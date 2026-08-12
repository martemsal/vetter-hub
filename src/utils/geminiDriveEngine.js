// Motor de Busca Neural Estilo Gemini para Google Drive
import { normalizeText, extractKeywords } from './searchEngine';

export function searchDriveWithGeminiIntelligence(userQuery, driveFiles) {
  if (!userQuery || !driveFiles || driveFiles.length === 0) {
    return {
      status: 'not_found',
      file: null,
      message: 'Nenhum arquivo solicitado foi informado.',
      confidence: 0
    };
  }

  const normQuery = normalizeText(userQuery);
  const queryTokens = extractKeywords(userQuery);

  let scoredFiles = [];

  for (const file of driveFiles) {
    let score = 0;
    const normFileName = normalizeText(file.name);
    const normFileTitle = normalizeText(file.title);
    const normPropName = normalizeText(file.propertyName);

    // 1. Correspondência em Aliases Reais
    if (file.aliases && Array.isArray(file.aliases)) {
      for (const alias of file.aliases) {
        const normAlias = normalizeText(alias);
        if (normQuery.includes(normAlias) || normAlias.includes(normQuery)) {
          score += 40.0; // Forte correspondência
          break;
        }
      }
    }

    // 2. Correspondência no Nome do Arquivo Real do Drive
    if (normQuery.includes(normPropName)) {
      score += 25.0;
    } else {
      const propTokens = extractKeywords(file.propertyName);
      for (const pt of propTokens) {
        if (normQuery.includes(pt)) {
          score += 10.0;
        }
      }
    }

    // 3. Tokens no nome do arquivo
    for (const token of queryTokens) {
      if (normFileName.includes(token)) score += 4.0;
      if (normFileTitle.includes(token)) score += 3.0;
    }

    // 4. Intenções Específicas
    if (normQuery.includes('tabela') && file.category === 'tabela') score += 10.0;
    if (normQuery.includes('book') || normQuery.includes('apresentacao') || normQuery.includes('apresentação')) {
      if (file.category === 'book') score += 15.0;
    }

    if (score > 10.0) {
      scoredFiles.push({ file, score });
    }
  }

  scoredFiles.sort((a, b) => b.score - a.score);

  const THRESHOLD = 16.0;

  if (scoredFiles.length > 0 && scoredFiles[0].score >= THRESHOLD) {
    const bestMatch = scoredFiles[0].file;
    return {
      status: 'found',
      file: bestMatch,
      message: `Arquivo localizado: **${bestMatch.name}**`,
      confidence: scoredFiles[0].score
    };
  }

  // Lista dos nomes dos empreendimentos disponíveis no Drive
  const availableProps = Array.from(new Set(driveFiles.map(f => f.propertyName)));

  return {
    status: 'not_found',
    file: null,
    message: `❌ Não localizei o arquivo para **"${userQuery}"** dentro das pastas do Google Drive.\n\n📂 **Arquivos e Tabelas disponíveis no Drive:**\n${availableProps.slice(0, 8).map(p => `• ${p}`).join('\n')}`,
    confidence: 0
  };
}
