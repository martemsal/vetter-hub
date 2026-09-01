// Motor de Busca e Disponibilidade Integrado ao Pipeline Vetter
import { ALL_PIPELINE_UNITS, PIPELINE_DATA_BY_PROPERTY, PIPELINE_PROPERTIES } from '../data/pipelineData';

/**
 * Obtém a lista de unidades de um empreendimento
 * @param {string} propertyId 
 * @returns {Array}
 */
export function getPropertyAvailability(propertyId) {
  if (PIPELINE_DATA_BY_PROPERTY[propertyId]) {
    return PIPELINE_DATA_BY_PROPERTY[propertyId].units;
  }
  return [];
}

/**
 * Retorna todos os empreendimentos disponíveis no Pipeline
 */
export function getAvailablePipelineProperties() {
  return PIPELINE_PROPERTIES;
}

/**
 * Parser para extrair valores monetários em texto
 * Ex: "até 3 milhões" -> 3000000, "até 2.5 mi" -> 2500000, "até 800 mil" -> 800000
 */
function extractMaxPriceFromQuery(text) {
  const norm = text.toLowerCase().replace(/\./g, '').replace(',', '.');
  
  // "até 3.5 milhões" ou "até 3 mi" ou "ate 3 milhoes" ou "3m"
  const millionMatch = norm.match(/(?:até|ate|abaixo de|menos de|maximo de|máximo de|no máximo)?\s*(\d+(?:\.\d+)?)\s*(?:milh[oõ]es|milhao|milhão|mi|m\b)/i);
  if (millionMatch) {
    return parseFloat(millionMatch[1]) * 1000000;
  }

  // "até 800 mil" ou "até 500k"
  const thousandMatch = norm.match(/(?:até|ate|abaixo de|menos de)?\s*(\d+(?:\.\d+)?)\s*(?:mil|k\b)/i);
  if (thousandMatch) {
    return parseFloat(thousandMatch[1]) * 1000;
  }

  // "até 3000000"
  const rawNumMatch = norm.match(/(?:até|ate|abaixo de|menos de)?\s*r?\$?\s*(\d{6,8})/i);
  if (rawNumMatch) {
    return parseFloat(rawNumMatch[1]);
  }

  return null;
}

/**
 * Parser para extrair tipologia de suítes
 * Ex: "3 suítes", "3s", "2 suítes", "2s", "4 suítes", "garden", "sala"
 */
function extractTypologyFromQuery(text) {
  const norm = text.toLowerCase();
  
  const suitesMatch = norm.match(/(\d)\s*(?:su[ií]tes|suites|suite|suíte|s\b)/i);
  if (suitesMatch) {
    return `${suitesMatch[1]}S`.toUpperCase();
  }

  if (norm.includes('garden')) return 'GARDEN';
  if (norm.includes('sala')) return 'SALA';
  if (norm.includes('decorado')) return 'DECORADO';

  return null;
}

/**
 * Responde perguntas conversacionais sobre disponibilidade do Pipeline
 * @param {string} query - Pergunta do usuário
 * @param {string|null} lastPropertyContextId - Contexto do último empreendimento
 * @returns {Promise<Object>} { matched: boolean, text: string, propertyId: string|null }
 */
export async function queryAvailabilityWithContext(query, lastPropertyContextId = null) {
  const norm = query.toLowerCase();

  // 1. Detectar se a pergunta refere-se a busca de arquivo de PDF/Tabela do Drive
  // Se for apenas o nome da tabela (ex: "Tabela do Bal Harbour"), deixa ir para o Google Drive
  const isFileRequest = norm.includes('tabela') || norm.includes('apresentacao') || norm.includes('apresentação') || norm.includes('book') || norm.includes('pdf');
  const hasSpecificUnitOrFilter = norm.match(/(?:unidade|apto|apto\.|apartamento|\d{3,4}|su[ií]tes|\d+s|milh[oõ]es|mil|vgv|valor|final)/i);

  if (isFileRequest && !hasSpecificUnitOrFilter) {
    return { matched: false, text: "", propertyId: null };
  }

  // 2. Extrair Filtros da Pergunta
  const targetTypology = extractTypologyFromQuery(query);
  const maxPrice = extractMaxPriceFromQuery(query);

  // 3. Detectar se foi citado algum empreendimento específico
  let property = null;
  for (const p of PIPELINE_PROPERTIES) {
    if (norm.includes(p.name.toLowerCase()) || norm.includes(p.id)) {
      property = p;
      break;
    }
  }

  // Se não citou o prédio, mas citou unidade e temos contexto anterior
  if (!property && lastPropertyContextId) {
    const unitMatch = norm.match(/(?:unidade|apto|apto\.|apartamento)?\s*(\d{3,4})/i);
    if (unitMatch) {
      property = PIPELINE_PROPERTIES.find(p => p.id === lastPropertyContextId);
    }
  }

  // CASO 1: Busca Multicritério Global de Suítes e/ou Faixa de Preço (Ex: "quais unidades 3 suítes temos disponíveis até 3 milhões")
  if (targetTypology || maxPrice !== null) {
    let pool = ALL_PIPELINE_UNITS.filter(u => u.situacao === 'Disponível');

    if (property) {
      pool = pool.filter(u => u.propertyId === property.id);
    }

    if (targetTypology) {
      pool = pool.filter(u => u.tipo.includes(targetTypology));
    }

    if (maxPrice !== null) {
      pool = pool.filter(u => u.valorNum > 0 && u.valorNum <= maxPrice);
    }

    // Ordenar pelo menor valor
    pool.sort((a, b) => a.valorNum - b.valorNum);

    if (pool.length > 0) {
      const typeLabel = targetTypology ? (targetTypology.includes('S') ? `${targetTypology.replace('S', '')} suítes` : targetTypology) : 'unidades';
      const priceLabel = maxPrice ? ` até R$ ${(maxPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '';
      const scopeLabel = property ? ` no **${property.name}**` : ' nos seguintes empreendimentos:';

      const resultsList = pool.slice(0, 15).map(u => 
        `• **${u.property}** — ${u.unit} (Tipo: **${u.tipo}** | Área: ${u.areaPrivativa}) ➔ **${u.valorVGV}**`
      ).join('\n');

      const extraCount = pool.length > 15 ? `\n\n*...e mais ${pool.length - 15} opções encontradas com esse perfil.*` : '';

      return {
        matched: true,
        text: `🏢 **Temos ${typeLabel}${priceLabel}${scopeLabel}**\nEncontramos **${pool.length} opções disponíveis** no Pipeline de Vendas:`,
        units: pool.slice(0, 15),
        totalCount: pool.length,
        propertyId: property ? property.id : null
      };
    } else {
      const typeLabel = targetTypology ? `${targetTypology.replace('S', '')} suítes` : '';
      const priceLabel = maxPrice ? ` até R$ ${(maxPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '';
      const scopeLabel = property ? ` no empreendimento **${property.name}**` : '';

      return {
        matched: true,
        text: `🔴 Não localizamos nenhuma unidade **${typeLabel}** disponível${priceLabel}${scopeLabel} no momento no Pipeline.`,
        units: [],
        propertyId: property ? property.id : null
      };
    }
  }

  // CASO 2: Consulta de Unidade Específica no Empreendimento (Ex: "Apto 1001 do Bal Harbour")
  const unitMatch = norm.match(/(?:unidade|apto|apto\.|apartamento)?\s*(\d{3,4})/i);
  if (unitMatch && property) {
    const targetUnitNum = unitMatch[1];
    const propertyUnits = getPropertyAvailability(property.id);
    const unitData = propertyUnits.find(u => u.unitNumber === targetUnitNum);

    if (unitData) {
      return {
        matched: true,
        text: `🏢 **${property.name} — ${unitData.unit}**\nInformações da unidade no Pipeline:`,
        units: [unitData],
        propertyId: property.id
      };
    }
  }

  // CASO 3: Consulta por Final no Empreendimento (Ex: "Final 01 do Bal Harbour")
  const finalMatch = norm.match(/final\s*(\d{1,2})/i);
  if (finalMatch && property) {
    const finalNum = finalMatch[1].padStart(2, '0');
    const propertyUnits = getPropertyAvailability(property.id);
    const matchingUnits = propertyUnits.filter(u => u.final === finalNum && u.situacao === 'Disponível');

    if (matchingUnits.length > 0) {
      return {
        matched: true,
        text: `🟢 **Unidades Disponíveis — ${property.name} (Final ${finalNum})**\nEncontramos **${matchingUnits.length} opções**:`,
        units: matchingUnits,
        propertyId: property.id
      };
    } else {
      return {
        matched: true,
        text: `🔴 Não encontramos unidades com **final ${finalNum}** disponíveis no **${property.name}**.`,
        units: [],
        propertyId: property.id
      };
    }
  }

  // CASO 4: Busca Geral de Disponibilidade do Empreendimento
  if (property && (norm.includes('disponib') || norm.includes('estoque') || norm.includes('unidades') || norm.includes('quantas'))) {
    const propertyUnits = getPropertyAvailability(property.id);
    const availableUnits = propertyUnits.filter(u => u.situacao === 'Disponível');

    if (availableUnits.length > 0) {
      return {
        matched: true,
        text: `🏢 **Unidades Disponíveis no ${property.name}**\nEncontramos **${availableUnits.length} unidades disponíveis**:`,
        units: availableUnits.slice(0, 15),
        totalCount: availableUnits.length,
        propertyId: property.id
      };
    }
  }

  return { matched: false, text: "", propertyId: null };
}
