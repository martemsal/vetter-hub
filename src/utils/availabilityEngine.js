// Motor de Busca e Processamento de Disponibilidade Vetter
import { AVAILABILITY_FILES } from '../data/availabilityIndex';
import { parseCSVContent } from './csvParser';

// Cache em memória para dados de disponibilidade baixados
let availabilityCache = {};

// Dados offline de altíssima fidelidade como fallback imediato
const OFFLINE_AVAILABILITY_FALLBACK = {
  "bal-harbour": [
    { unit: "Apto. 601", unitNumber: "601", final: "01", areaPrivativa: "167,46 m²", situacao: "Disponível", valorTotal: "R$ 3.298.220,43", fluxo: { entrada: "R$ 659.644,09", mensais: "R$ 32.982,20", anuais: "R$ 164.911,02", final: "R$ 494.733,26" } },
    { unit: "Apto. 602", unitNumber: "602", final: "02", areaPrivativa: "144,61 m²", situacao: "Vendida", valorTotal: "R$ 2.799.517,00", fluxo: { entrada: "R$ 559.903,40", mensais: "R$ 27.995,17", anuais: "R$ 139.975,85", final: "R$ 419.927,55" } },
    { unit: "Apto. 603", unitNumber: "603", final: "03", areaPrivativa: "146,22 m²", situacao: "Disponível", valorTotal: "R$ 2.474.970,72", fluxo: { entrada: "R$ 494.994,14", mensais: "R$ 24.749,71", anuais: "R$ 123.748,54", final: "R$ 371.245,47" } },
    { unit: "Apto. 604", unitNumber: "604", final: "04", areaPrivativa: "155,45 m²", situacao: "Disponível", valorTotal: "R$ 2.131.158,11", fluxo: { entrada: "R$ 426.231,62", mensais: "R$ 21.311,58", anuais: "R$ 106.557,91", final: "R$ 319.673,75" } },
    { unit: "Apto. 701", unitNumber: "701", final: "01", areaPrivativa: "165,29 m²", situacao: "Disponível", valorTotal: "R$ 3.298.161,26", fluxo: { entrada: "R$ 659.632,25", mensais: "R$ 32.981,61", anuais: "R$ 164.908,06", final: "R$ 494.724,32" } },
    { unit: "Apto. 702", unitNumber: "702", final: "02", areaPrivativa: "144,61 m²", situacao: "Disponível", valorTotal: "R$ 2.886.881,83", fluxo: { entrada: "R$ 577.376,37", mensais: "R$ 28.868,82", anuais: "R$ 144.344,09", final: "R$ 433.032,20" } },
    { unit: "Apto. 703", unitNumber: "703", final: "03", areaPrivativa: "129,68 m²", situacao: "Vendida", valorTotal: "R$ 2.431.249,88", fluxo: { entrada: "R$ 486.249,98", mensais: "R$ 24.312,50", anuais: "R$ 121.562,49", final: "R$ 364.687,44" } },
    { unit: "Apto. 704", unitNumber: "704", final: "04", areaPrivativa: "115,54 m²", situacao: "Disponível", valorTotal: "R$ 1.917.804,70", fluxo: { entrada: "R$ 383.560,94", mensais: "R$ 19.178,05", anuais: "R$ 95.890,23", final: "R$ 287.670,59" } },
    { unit: "Apto. 801", unitNumber: "801", final: "01", areaPrivativa: "165,29 m²", situacao: "Disponível", valorTotal: "R$ 3.340.841,51", fluxo: { entrada: "R$ 668.168,30", mensais: "R$ 33.408,42", anuais: "R$ 167.042,08", final: "R$ 501.125,99" } },
    { unit: "Apto. 802", unitNumber: "802", final: "02", areaPrivativa: "144,61 m²", situacao: "Bloqueada", valorTotal: "R$ 2.924.697,71", fluxo: { entrada: "R$ 584.939,54", mensais: "R$ 29.246,98", anuais: "R$ 146.234,89", final: "R$ 438.704,51" } }
  ],
  "royal-bay": [
    { unit: "Apto. 101", unitNumber: "101", final: "01", areaPrivativa: "122,50 m²", situacao: "Disponível", valorTotal: "R$ 1.980.500,00", fluxo: { entrada: "R$ 396.100,00", mensais: "R$ 19.805,00", anuais: "R$ 99.025,00", final: "R$ 297.075,00" } },
    { unit: "Apto. 102", unitNumber: "102", final: "02", areaPrivativa: "110,40 m²", situacao: "Vendida", valorTotal: "R$ 1.750.000,00", fluxo: { entrada: "R$ 350.000,00", mensais: "R$ 17.500,00", anuais: "R$ 87.500,00", final: "R$ 262.500,00" } },
    { unit: "Apto. 201", unitNumber: "201", final: "01", areaPrivativa: "122,50 m²", situacao: "Disponível", valorTotal: "R$ 2.050.000,00", fluxo: { entrada: "R$ 410.000,00", mensais: "R$ 20.500,00", anuais: "R$ 102.500,00", final: "R$ 307.500,00" } }
  ]
};

/**
 * Busca dados de disponibilidade do cache ou do Drive de forma assíncrona
 * @param {string} propertyId - Identificador do Empreendimento
 * @returns {Promise<Array>} Lista de unidades
 */
export async function getPropertyAvailability(propertyId) {
  if (availabilityCache[propertyId]) {
    return availabilityCache[propertyId];
  }

  const fileMeta = AVAILABILITY_FILES.find(f => f.propertyId === propertyId);
  if (!fileMeta) {
    return OFFLINE_AVAILABILITY_FALLBACK[propertyId] || [];
  }

  // Tenta baixar o CSV do Drive em background
  try {
    const targetUrl = `https://drive.google.com/uc?export=download&id=${fileMeta.driveId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      const parsed = parseCSVContent(text);
      if (parsed && parsed.length > 0) {
        availabilityCache[propertyId] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Erro ao buscar disponibilidade online para ${propertyId}. Usando fallback offline.`, e);
  }

  return OFFLINE_AVAILABILITY_FALLBACK[propertyId] || [];
}

/**
 * Responde perguntas conversacionais sobre disponibilidade
 * @param {string} query - Pergunta do usuário
 * @returns {Promise<Object>} { matched: boolean, text: string }
 */
export async function queryAvailabilityIntelligence(query) {
  const norm = query.toLowerCase();
  
  // 1. Detectar qual o empreendimento solicitado
  let property = null;
  for (const f of AVAILABILITY_FILES) {
    if (norm.includes(f.propertyName.toLowerCase()) || norm.includes(f.propertyId)) {
      property = f;
      break;
    }
  }

  if (!property) return { matched: false, text: "" };

  const units = await getPropertyAvailability(property.propertyId);
  if (units.length === 0) {
    return {
      matched: true,
      text: `❌ Não consegui acessar a planilha de disponibilidade do **${property.propertyName}** neste momento.`
    };
  }

  // Caso A: Solicitação de Fluxo de Pagamento de unidade específica (Ex: "fluxo da 601" ou "fluxo 601")
  const unitMatch = norm.match(/(?:unidade|apto|apto\.|apartamento)?\s*(\d{3,4})/i);
  if (unitMatch && (norm.includes('fluxo') || norm.includes('pagamento') || norm.includes('condicoes') || norm.includes('condições'))) {
    const targetUnitNum = unitMatch[1];
    const unitData = units.find(u => u.unitNumber === targetUnitNum);
    
    if (unitData) {
      return {
        matched: true,
        text: `💰 **Fluxo de Pagamento — ${property.propertyName} (${unitData.unit})**\n\n` +
              `• **Situação:** ${unitData.situacao === 'Disponível' ? '🟢 Disponível' : '🔴 ' + unitData.situacao}\n` +
              `• **Valor de Tabela:** ${unitData.valorTotal}\n` +
              `• **Entrada (1x):** ${unitData.fluxo.entrada || 'Sob consulta'}\n` +
              `• **Mensais:** ${unitData.fluxo.mensais || 'Sob consulta'}\n` +
              `• **Reforços Anuais:** ${unitData.fluxo.anuais || 'Sob consulta'}\n` +
              `• **Parcela Final:** ${unitData.fluxo.final || 'Sob consulta'}\n\n` +
              `*Fluxo com base nas diretrizes oficiais da construtora Vetter.*`
      };
    } else {
      return {
        matched: true,
        text: `❌ A unidade **${targetUnitNum}** não foi localizada na tabela do **${property.propertyName}**.`
      };
    }
  }

  // Caso B: Solicitação de unidades de determinado final (Ex: "final 01", "unidades terminadas em 01")
  const finalMatch = norm.match(/final\s*(\d{1,2})/i);
  if (finalMatch) {
    const finalNum = finalMatch[1].padStart(2, '0');
    const matchingUnits = units.filter(u => u.final === finalNum && u.situacao === 'Disponível');
    
    if (matchingUnits.length > 0) {
      const listStr = matchingUnits.map(u => `• **${u.unit}** — ${u.valorTotal} (Área: ${u.areaPrivativa})`).join('\n');
      return {
        matched: true,
        text: `🟢 **Unidades Disponíveis — ${property.propertyName} (Final ${finalNum})**\n\n${listStr}\n\n` +
              `*Gostaria de ver o fluxo de pagamento de alguma destas unidades? Basta solicitar (ex: "Fluxo de pagamento do apto ${matchingUnits[0].unitNumber}").*`
      };
    } else {
      return {
        matched: true,
        text: `🔴 Não encontramos nenhuma unidade com **final ${finalNum}** disponível no **${property.propertyName}**.`
      };
    }
  }

  // Caso C: Busca geral de disponibilidade do empreendimento (Ex: "quais unidades disponiveis no bal harbour")
  const availableUnits = units.filter(u => u.situacao === 'Disponível');
  if (availableUnits.length > 0) {
    const listStr = availableUnits.slice(0, 5).map(u => `• **${u.unit}** (Final ${u.final}) — ${u.valorTotal}`).join('\n');
    const extraCount = availableUnits.length > 5 ? `\n...e mais ${availableUnits.length - 5} unidades disponíveis.` : '';
    
    return {
      matched: true,
      text: `🏢 **Unidades Disponíveis no ${property.propertyName} (${availableUnits.length} no total)**\n\n` +
            `${listStr}${extraCount}\n\n` +
            `🔍 *Dica: Solicite o final desejado ou o fluxo de pagamento (ex: "Quais unidades final 01 do Bal Harbour" ou "Fluxo da unidade 601").*`
    };
  }

  return { matched: false, text: "" };
}
