// Motor de Busca Neural Estilo Gemini para Google Drive (Zero Alucinações)
import { normalizeText, extractKeywords, detectCategoryIntent } from './searchEngine';

/**
 * Busca de Alta Precisão nos arquivos do Google Drive
 * @param {string} userQuery - Pergunta ou pedido do usuário (texto ou transcrição de voz)
 * @param {Array} driveFiles - Lista completa de arquivos indexados do Drive
 * @returns {Object} { status: 'found'|'not_found', file: Object|null, message: string, confidence: number }
 */
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
  const detectedCategories = detectCategoryIntent(userQuery);

  let scoredFiles = [];

  for (const file of driveFiles) {
    let score = 0;
    const normFileName = normalizeText(file.name);
    const normFileTitle = normalizeText(file.title);
    const normPropName = normalizeText(file.propertyName);

    // 1. Match em Aliases Diretos (Ex: "tabela do bal harbour", "tabela bal harbour")
    if (file.aliases && Array.isArray(file.aliases)) {
      for (const alias of file.aliases) {
        const normAlias = normalizeText(alias);
        if (normQuery.includes(normAlias) || normAlias.includes(normQuery)) {
          score += 35.0; // Correspondência quase exata de intenção
          break;
        }
      }
    }

    // 2. Score por Nome do Empreendimento (Bal Harbour, Royal Bay, The Ocean, etc.)
    let propMatched = false;
    if (normQuery.includes(normPropName)) {
      score += 20.0;
      propMatched = true;
    } else {
      // Checa se tokens essenciais do empreendimento batem
      const propTokens = extractKeywords(file.propertyName);
      let matchCount = 0;
      for (const pt of propTokens) {
        if (queryTokens.includes(pt) || normQuery.includes(pt)) {
          matchCount++;
        }
      }
      if (matchCount > 0 && matchCount >= propTokens.length * 0.5) {
        score += matchCount * 8.0;
        propMatched = true;
      }
    }

    // 3. Score por Categoria do Arquivo (tabela, book, planta, foto)
    if (detectedCategories && detectedCategories.includes(file.category)) {
      score += 15.0;
    }

    // 4. Score por palavras no Nome do Arquivo / Título
    for (const token of queryTokens) {
      if (normFileName.includes(token)) score += 3.0;
      if (normFileTitle.includes(token)) score += 3.0;
    }

    // 5. Penalização se a categoria detectada for conflitante
    if (detectedCategories && !detectedCategories.includes(file.category)) {
      score -= 10.0;
    }

    if (score > 12.0) {
      scoredFiles.push({ file, score });
    }
  }

  // Ordenar por score decrescente
  scoredFiles.sort((a, b) => b.score - a.score);

  // Validação Estrita (Zero Alucinação / Sem arquivos aleatórios)
  const THRESHOLD = 22.0;

  if (scoredFiles.length > 0 && scoredFiles[0].score >= THRESHOLD) {
    const bestMatch = scoredFiles[0].file;
    return {
      status: 'found',
      file: bestMatch,
      message: `Arquivo localizado: **${bestMatch.propertyName}**`,
      confidence: scoredFiles[0].score
    };
  }

  // SE NÃO ENCONTROU O ARQUIVO ESPECÍFICO, NÃO TRAGA OUTRO ALEATÓRIO!
  return {
    status: 'not_found',
    file: null,
    message: `❌ Não localizei o arquivo para **"${userQuery}"** nas pastas do Google Drive.\n\nVerifique se o nome do empreendimento ou documento está correto (ex: *Bal Harbour*, *Royal Bay*, *The Ocean*, *Palm Beach*, *Sunset* ou *Grand Palais*).`,
    confidence: 0
  };
}
