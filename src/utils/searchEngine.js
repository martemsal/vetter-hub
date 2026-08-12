// Motor de Busca Semântica, Sinônimos e Fuzzy Matching para Arquivos Imobiliários Vetter

// Dicionário de Sinônimos por Categoria de Arquivo
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
    'catalogo', 'catálogo', 'lâmina', 'lamina', 'brochura', 'material', 'vendas', 
    'institucional', 'conceito', 'memorial'
  ],
  foto: [
    'foto', 'fotos', 'render', 'renders', 'imagem', 'imagens', 'perspectiva', 
    'perspectivas', '3d', 'fachada', 'obra', 'obras', 'lazer', 'piscina', 
    'living', 'decorado', 'vista', 'mar', 'acompanhamento'
  ],
  video: [
    'video', 'vídeo', 'videos', 'vídeos', 'tour', 'virtual', 'drone', 'teaser', 'filmagem'
  ]
};

// Normalização de texto: remove acentos, pontuação e converte para minúsculas
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[_\-./\\(),;:[\]]/g, ' ') // substitui separadores por espaço
    .replace(/\s+/g, ' ')
    .trim();
}

// Remove stopwords comuns em consultas em português
const STOPWORDS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'pra', 'com', 'sem', 'que', 'e',
  'me', 'eu', 'voce', 'quero', 'gostaria', 'trazer', 'traga', 'buscar', 'ache',
  'encontre', 'mande', 'envie', 'favor', 'porfavor', 'the'
]);

export function extractKeywords(query) {
  const normalized = normalizeText(query);
  const words = normalized.split(' ').filter(w => w.length > 1 && !STOPWORDS.has(w));
  return words;
}

// Identifica a intenção do tipo de arquivo (tabela, planta, book, foto, video)
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

// Similaridade básica de N-gram / substring
function calculateTextOverlap(queryTokens, targetText) {
  const normTarget = normalizeText(targetText);
  let score = 0;

  for (const token of queryTokens) {
    if (normTarget.includes(token)) {
      score += 2.0; // correspondência exata de token
    } else {
      // Correspondência parcial (ex: "ocean" em "the ocean" ou "ocean park")
      for (const targetWord of normTarget.split(' ')) {
        if (targetWord.includes(token) || token.includes(targetWord)) {
          if (Math.min(token.length, targetWord.length) >= 3) {
            score += 1.2;
          }
        }
      }
    }
  }

  return score;
}

/**
 * Busca inteligente e flexível em todo o acervo de arquivos dos empreendimentos
 * @param {string} userQuery - Consulta em texto ou voz (ex: "quero a tabela do The Ocean")
 * @param {Array} propertiesData - Lista de empreendimentos com seus arquivos
 * @returns {Object} - { matchedFiles: Array, matchedProperty: Object, confidenceScore: number }
 */
export function findMatchingFiles(userQuery, propertiesData) {
  if (!userQuery || !propertiesData || propertiesData.length === 0) {
    return { matchedFiles: [], matchedProperty: null, confidenceScore: 0 };
  }

  const queryTokens = extractKeywords(userQuery);
  const categoriesIntent = detectCategoryIntent(userQuery);
  const normQuery = normalizeText(userQuery);

  let scoredFiles = [];

  // Varrer todos os arquivos de todos os empreendimentos
  propertiesData.forEach((property) => {
    // Score do empreendimento na consulta
    const propNameScore = calculateTextOverlap(queryTokens, property.name) * 2.5 +
      calculateTextOverlap(queryTokens, property.tagline || '') * 1.5 +
      calculateTextOverlap(queryTokens, property.city || '') * 1.0;

    const allFiles = property.files || [];

    allFiles.forEach((file) => {
      let fileScore = propNameScore;

      // 1. Score do nome do arquivo e título
      const titleScore = calculateTextOverlap(queryTokens, file.title || '') * 3.0;
      const fileNameScore = calculateTextOverlap(queryTokens, file.name || '') * 3.0;
      fileScore += titleScore + fileNameScore;

      // 2. Bônus por categoria correspondente
      if (categoriesIntent && categoriesIntent.includes(file.category)) {
        fileScore += 5.0;
      }

      // 3. Casos especiais: se o nome do arquivo tem correspondência direta com os tokens
      for (const token of queryTokens) {
        if (normalizeText(file.name).includes(token)) {
          fileScore += 2.0;
        }
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

  // Ordenar arquivos pelo maior score
  scoredFiles.sort((a, b) => b.score - a.score);

  if (scoredFiles.length === 0) {
    // Fallback: se nada específico foi detectado, traz o primeiro empreendimento
    const fallbackProp = propertiesData[0];
    return {
      matchedFiles: (fallbackProp.files || []).slice(0, 3),
      matchedProperty: fallbackProp,
      confidenceScore: 0.2
    };
  }

  // Filtrar os melhores resultados
  const topScore = scoredFiles[0].score;
  const bestFiles = scoredFiles
    .filter(item => item.score >= topScore * 0.45)
    .slice(0, 4)
    .map(item => item.file);

  return {
    matchedFiles: bestFiles,
    matchedProperty: scoredFiles[0].property,
    confidenceScore: Math.min(topScore / 10, 1.0)
  };
}
