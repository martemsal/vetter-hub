// Motor de Busca Semântica Estrita - Retorna Exclusivamente o Arquivo Solicitado

const CATEGORY_SYNONYMS = {
  tabela: [
    'tabela', 'tabelas', 'preço', 'preco', 'preços', 'precos', 'valor', 'valores', 
    'custo', 'pagamento', 'condições', 'condicoes', 'fluxo', 'disponibilidade', 
    'vendas', 'venda', 'espelho', 'saldo', 'parcelas'
  ],
  planta: [
    'planta', 'plantas', 'planta baixa', 'cota', 'cotas', 'dimensão', 'dimensao', 
    'dimensões', 'dimensoes', 'metragem', 'm²', 'm2', 'layout', 'humanizada', 
    'arquitetura', 'tipo', 'tipo 01', 'tipo 02', 'tipo 03', 'diferenciada', 
    'cobertura', 'duplex', 'cômodo', 'comodo', 'living', 'suíte', 'suite'
  ],
  book: [
    'book', 'apresentação', 'apresentacao', 'apresentacoes', 'comercial', 'folder', 
    'catalogo', 'catálogo', 'lâmina', 'lamina', 'brochura', 'material', 'memorial'
  ],
  foto: [
    'foto', 'fotos', 'render', 'renders', 'imagem', 'imagens', 'perspectiva', 
    'perspectivas', '3d', 'fachada', 'obra', 'obras', 'lazer', 'piscina', 
    'living', 'decorado', 'vista'
  ],
  video: [
    'video', 'vídeo', 'videos', 'vídeos', 'tour', 'virtual', 'drone', 'teaser', 'filmagem'
  ]
};

export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\-./\\(),;:[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'pra', 'com', 'sem', 'que', 'e',
  'me', 'eu', 'voce', 'quero', 'gostaria', 'trazer', 'traga', 'buscar', 'ache',
  'encontre', 'mande', 'envie', 'favor', 'porfavor', 'the', 'somente', 'apenas', 'so'
]);

export function extractKeywords(query) {
  const normalized = normalizeText(query);
  return normalized.split(' ').filter(w => w.length > 1 && !STOPWORDS.has(w));
}

export function detectCategoryIntent(query) {
  const normQuery = normalizeText(query);
  const detected = [];

  for (const [category, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    for (const syn of synonyms) {
      if (normQuery.includes(syn)) {
        detected.push(category);
        break;
      }
    }
  }

  return detected.length > 0 ? detected : null;
}

function calculateTextOverlap(queryTokens, targetText) {
  const normTarget = normalizeText(targetText);
  let score = 0;

  for (const token of queryTokens) {
    if (normTarget.includes(token)) {
      score += 3.0;
    } else {
      for (const targetWord of normTarget.split(' ')) {
        if (targetWord.includes(token) || token.includes(targetWord)) {
          if (Math.min(token.length, targetWord.length) >= 3) {
            score += 1.5;
          }
        }
      }
    }
  }

  return score;
}

/**
 * Busca estrita: Retorna unicamente o arquivo exato mais relevante para não criar confusão
 */
export function findMatchingFiles(userQuery, propertiesData) {
  if (!userQuery || !propertiesData || propertiesData.length === 0) {
    return { matchedFiles: [], matchedProperty: null, confidenceScore: 0 };
  }

  const queryTokens = extractKeywords(userQuery);
  const categoriesIntent = detectCategoryIntent(userQuery);

  let scoredFiles = [];

  propertiesData.forEach((property) => {
    const propNameScore = calculateTextOverlap(queryTokens, property.name) * 3.0 +
      calculateTextOverlap(queryTokens, property.tagline || '') * 1.0;

    const allFiles = property.files || [];

    allFiles.forEach((file) => {
      let fileScore = propNameScore;

      // Score do título e nome do arquivo
      const titleScore = calculateTextOverlap(queryTokens, file.title || '') * 4.0;
      const fileNameScore = calculateTextOverlap(queryTokens, file.name || '') * 4.0;
      fileScore += titleScore + fileNameScore;

      // Bônus forte pela categoria exata solicitada (tabela, planta, book, foto)
      if (categoriesIntent && categoriesIntent.includes(file.category)) {
        fileScore += 8.0;
      }

      if (fileScore > 0) {
        scoredFiles.push({
          file: {
            ...file,
            propertyName: property.name,
            propertyCity: property.city
          },
          property,
          score: fileScore
        });
      }
    });
  });

  scoredFiles.sort((a, b) => b.score - a.score);

  if (scoredFiles.length === 0) {
    return { matchedFiles: [], matchedProperty: null, confidenceScore: 0 };
  }

  // RETORNA RIGOROSAMENTE APENAS 1 ARQUIVO (O MAIS RELEVANTE)
  const exactFile = [scoredFiles[0].file];

  return {
    matchedFiles: exactFile,
    matchedProperty: scoredFiles[0].property,
    confidenceScore: scoredFiles[0].score
  };
}
