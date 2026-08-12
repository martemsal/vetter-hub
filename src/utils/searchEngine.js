// Motor de Busca Semântica Estrita e Reconhecimento Fonético de Empreendimentos Vetter

const CATEGORY_SYNONYMS = {
  tabela: [
    'tabela', 'tabelas', 'preço', 'preco', 'preços', 'precos', 'valor', 'valores', 
    'custo', 'pagamento', 'condições', 'condicoes', 'fluxo', 'disponibilidade', 
    'vendas', 'venda', 'espelho', 'saldo', 'parcelas', 'presente a tabela'
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
    'perspectivas', '3d', 'fachada', 'obra', 'obras', 'lazer', 'piscina', 'living'
  ],
  video: [
    'video', 'vídeo', 'videos', 'vídeos', 'tour', 'virtual', 'drone', 'teaser'
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
  'encontre', 'mande', 'envie', 'favor', 'porfavor', 'the', 'somente', 'apenas', 'so',
  'presente', 'mostre', 'exiba', 'baixe'
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
      score += 4.0;
    } else {
      for (const targetWord of normTarget.split(' ')) {
        if (targetWord.includes(token) || token.includes(targetWord)) {
          if (Math.min(token.length, targetWord.length) >= 3) {
            score += 2.0;
          }
        }
      }
    }
  }

  return score;
}

/**
 * Busca estrita por empreendimento + arquivo
 */
export function findMatchingFiles(userQuery, propertiesData) {
  if (!userQuery || !propertiesData || propertiesData.length === 0) {
    return { matchedFiles: [], matchedProperty: null, confidenceScore: 0 };
  }

  const normQuery = normalizeText(userQuery);
  const queryTokens = extractKeywords(userQuery);
  const categoriesIntent = detectCategoryIntent(userQuery);

  let bestProperty = null;
  let highestPropScore = 0;

  // 1. Identificar com precisão o empreendimento
  propertiesData.forEach((property) => {
    let propScore = calculateTextOverlap(queryTokens, property.name) * 3.0;

    // Verificar aliases fonéticos (ex: "royal baby" -> "Royal Bay Vetter")
    if (property.aliases) {
      for (const alias of property.aliases) {
        if (normQuery.includes(normalizeText(alias))) {
          propScore += 15.0; // Forte correspondência de alias
          break;
        }
      }
    }

    if (propScore > highestPropScore) {
      highestPropScore = propScore;
      bestProperty = property;
    }
  });

  // Se nenhum empreendimento teve score mínimo, não força um errado
  if (!bestProperty || highestPropScore < 2.0) {
    // Tenta encontrar por nome de arquivo direto em toda a base
    let candidateFiles = [];
    propertiesData.forEach(p => {
      p.files?.forEach(f => {
        const fileScore = calculateTextOverlap(queryTokens, f.name) + calculateTextOverlap(queryTokens, f.title);
        if (fileScore > 2.0) {
          candidateFiles.push({ file: { ...f, propertyName: p.name }, score: fileScore, property: p });
        }
      });
    });

    if (candidateFiles.length > 0) {
      candidateFiles.sort((a, b) => b.score - a.score);
      return {
        matchedFiles: [candidateFiles[0].file],
        matchedProperty: candidateFiles[0].property,
        confidenceScore: candidateFiles[0].score
      };
    }

    return { matchedFiles: [], matchedProperty: null, confidenceScore: 0 };
  }

  // 2. Com o empreendimento identificado, buscar o arquivo específico dentro dele
  const files = bestProperty.files || [];
  let scoredFiles = [];

  files.forEach((file) => {
    let fileScore = 1.0;

    // Bônus pela categoria exata solicitada (tabela, planta, book, foto)
    if (categoriesIntent && categoriesIntent.includes(file.category)) {
      fileScore += 10.0;
    }

    // Score por palavras do título/nome
    fileScore += calculateTextOverlap(queryTokens, file.title) * 3.0;
    fileScore += calculateTextOverlap(queryTokens, file.name) * 3.0;

    scoredFiles.push({
      file: {
        ...file,
        propertyName: bestProperty.name,
        propertyCity: bestProperty.city
      },
      property: bestProperty,
      score: fileScore
    });
  });

  scoredFiles.sort((a, b) => b.score - a.score);

  if (scoredFiles.length === 0) {
    return { matchedFiles: [], matchedProperty: bestProperty, confidenceScore: 0 };
  }

  // Retorna rigorosamente APENAS O ARQUIVO SOLICITADO
  return {
    matchedFiles: [scoredFiles[0].file],
    matchedProperty: bestProperty,
    confidenceScore: scoredFiles[0].score
  };
}
