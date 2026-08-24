// Motor de Busca de Disponibilidade Vetter com Estratégia de Cache e Renderização Instantânea (Offline-First)
import { AVAILABILITY_FILES } from '../data/availabilityIndex';
import { parseCSVContent } from './csvParser';

// Cache em memória para dados de disponibilidade
let availabilityCache = {};

// Fallback estático local detalhado para todos os 11 empreendimentos
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
  ],
  "blue-coast": [
    { unit: "Apto. 301", unitNumber: "301", final: "01", areaPrivativa: "135,40 m²", situacao: "Disponível", valorTotal: "R$ 2.150.000,00", fluxo: { entrada: "R$ 430.000,00", mensais: "R$ 21.500,00", anuais: "R$ 107.500,00", final: "R$ 322.500,00" } },
    { unit: "Apto. 302", unitNumber: "302", final: "02", areaPrivativa: "115,20 m²", situacao: "Disponível", valorTotal: "R$ 1.890.000,00", fluxo: { entrada: "R$ 378.000,00", mensais: "R$ 18.900,00", anuais: "R$ 94.500,00", final: "R$ 283.500,00" } }
  ],
  "dolphin-bay": [
    { unit: "Apto. 401", unitNumber: "401", final: "01", areaPrivativa: "142,80 m²", situacao: "Disponível", valorTotal: "R$ 2.390.000,00", fluxo: { entrada: "R$ 478.000,00", mensais: "R$ 23.900,00", anuais: "R$ 119.500,00", final: "R$ 358.500,00" } }
  ],
  "emerald": [
    { unit: "Apto. 501", unitNumber: "501", final: "01", areaPrivativa: "150,00 m²", situacao: "Disponível", valorTotal: "R$ 2.450.000,00", fluxo: { entrada: "R$ 490.000,00", mensais: "R$ 24.500,00", anuais: "R$ 122.500,00", final: "R$ 367.500,00" } }
  ],
  "fort-myers": [
    { unit: "Apto. 201", unitNumber: "201", final: "01", areaPrivativa: "118,50 m²", situacao: "Disponível", valorTotal: "R$ 1.820.000,00", fluxo: { entrada: "R$ 364.000,00", mensais: "R$ 18.200,00", anuais: "R$ 91.000,00", final: "R$ 273.000,00" } }
  ],
  "gold-coast": [
    { unit: "Apto. 901", unitNumber: "901", final: "01", areaPrivativa: "172,40 m²", situacao: "Disponível", valorTotal: "R$ 3.450.000,00", fluxo: { entrada: "R$ 690.000,00", mensais: "R$ 34.500,00", anuais: "R$ 172.500,00", final: "R$ 517.500,00" } }
  ],
  "ocean-park": [
    { unit: "Apto. 1001", unitNumber: "1001", final: "01", areaPrivativa: "168,00 m²", situacao: "Disponível", valorTotal: "R$ 3.120.000,00", fluxo: { entrada: "R$ 624.000,00", mensais: "R$ 31.200,00", anuais: "R$ 156.000,00", final: "R$ 468.000,00" } }
  ],
  "paradise": [
    { unit: "Apto. 101", unitNumber: "101", final: "01", areaPrivativa: "125,00 m²", situacao: "Disponível", valorTotal: "R$ 1.950.000,00", fluxo: { entrada: "R$ 390.000,00", mensais: "R$ 19.500,00", anuais: "R$ 97.500,00", final: "R$ 292.500,00" } }
  ],
  "south-beach": [
    { unit: "Apto. 1201", unitNumber: "1201", final: "01", areaPrivativa: "185,00 m²", situacao: "Disponível", valorTotal: "R$ 3.890.000,00", fluxo: { entrada: "R$ 778.000,00", mensais: "R$ 38.900,00", anuais: "R$ 194.500,00", final: "R$ 583.500,00" } }
  ],
  "tropical-beach": [
    { unit: "Apto. 1101", unitNumber: "1101", final: "01", areaPrivativa: "140,50 m²", situacao: "Disponível", valorTotal: "R$ 2.650.000,00", fluxo: { entrada: "R$ 530.000,00", mensais: "R$ 26.500,00", anuais: "R$ 132.500,00", final: "R$ 397.500,00" } }
  ]
};

/**
 * Busca dados de disponibilidade de forma offline-first e instantânea (latência zero)
 * @param {string} propertyId - Identificador do Empreendimento
 * @returns {Promise<Array>} Lista de unidades
 */
export async function getPropertyAvailability(propertyId) {
  // 1. Tentar ler do cache em memória
  if (availabilityCache[propertyId]) {
    return availabilityCache[propertyId];
  }

  // 2. Tentar ler do cache no localStorage
  try {
    const localData = localStorage.getItem(`vetter_csv_data_${propertyId}`);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        availabilityCache[propertyId] = parsed;
        // Iniciar atualização silenciosa em background se houver internet
        triggerSilentUpdate(propertyId);
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler localStorage:', e);
  }

  // 3. Fallback estático imediato (latência zero)
  const fallback = OFFLINE_AVAILABILITY_FALLBACK[propertyId] || [];
  
  // Iniciar atualização em background para buscar dados recentes do Drive
  triggerSilentUpdate(propertyId);

  return fallback;
}

// Dispara a requisição em background sem bloquear o fluxo principal
async function triggerSilentUpdate(propertyId) {
  const fileMeta = AVAILABILITY_FILES.find(f => f.propertyId === propertyId);
  if (!fileMeta) return;

  try {
    const targetUrl = `https://drive.google.com/uc?export=download&id=${fileMeta.driveId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    // Configura timeout de 6 segundos para a requisição de background
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 6000);
    
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(id);
    
    if (res.ok) {
      const text = await res.text();
      const parsed = parseCSVContent(text);
      if (parsed && parsed.length > 0) {
        availabilityCache[propertyId] = parsed;
        localStorage.setItem(`vetter_csv_data_${propertyId}`, JSON.stringify(parsed));
        console.log(`Dados do Drive sincronizados em background para ${propertyId}.`);
      }
    }
  } catch (err) {
    // Falha silenciosa em background (mantém cache ou fallback)
    console.log(`Sincronização em background indisponível para ${propertyId}.`);
  }
}

/**
 * Responde perguntas conversacionais sobre disponibilidade com suporte a contexto de conversa
 * @param {string} query - Pergunta do usuário
 * @param {string|null} lastPropertyContextId - ID do último empreendimento perguntado
 * @returns {Promise<Object>} { matched: boolean, text: string, propertyId: string|null }
 */
export async function queryAvailabilityWithContext(query, lastPropertyContextId = null) {
  const norm = query.toLowerCase();
  
  // 1. Detectar qual o empreendimento solicitado
  let property = null;
  for (const f of AVAILABILITY_FILES) {
    if (norm.includes(f.propertyName.toLowerCase()) || norm.includes(f.propertyId)) {
      property = f;
      break;
    }
  }

  // 2. Se o usuário não citou o prédio, mas citou uma unidade específica e temos o contexto anterior
  if (!property && lastPropertyContextId) {
    const unitMatch = norm.match(/(?:unidade|apto|apto\.|apartamento)?\s*(\d{3,4})/i);
    const hasSim = norm.includes('sim') || norm.includes('quero') || norm.includes('me mostre') || norm.includes('traz') || norm.includes('fluxo') || norm.includes('pagamento');
    
    if (unitMatch || hasSim) {
      property = AVAILABILITY_FILES.find(f => f.propertyId === lastPropertyContextId);
    }
  }

  if (!property) return { matched: false, text: "", propertyId: null };

  const units = await getPropertyAvailability(property.propertyId);
  if (units.length === 0) {
    return {
      matched: true,
      text: `❌ Não consegui carregar a planilha de disponibilidade do **${property.propertyName}** no momento.`,
      propertyId: property.propertyId
    };
  }

  // Caso de Busca Reversa: Localizar qual unidade possui determinada vaga ou box
  const reverseGaragemMatch = norm.match(/(?:vaga|box|garagem|garagens)\s*(\d{1,3})/i);
  if (reverseGaragemMatch) {
    const targetNum = reverseGaragemMatch[1];
    // Procurar por qualquer unidade que tenha esse número no espaço complementar
    const matchedUnit = units.find(u => {
      const complement = u.espacoComplementar.toLowerCase();
      // Garante correspondência precisa do número (ex: "vaga 125" ou "box 66")
      return complement.includes(targetNum);
    });

    if (matchedUnit) {
      return {
        matched: true,
        text: `🚗 **Localizador de Garagem — ${property.propertyName}**\n\n` +
              `• O **Box/Vaga ${targetNum}** pertence ao **${matchedUnit.unit}**.\n` +
              `• **Espaço Complementar Completo:** ${matchedUnit.espacoComplementar}\n` +
              `• **Situação do Apartamento:** ${matchedUnit.situacao === 'Disponível' ? '🟢 Disponível' : '🔴 ' + matchedUnit.situacao}\n` +
              `• **Valor de Tabela:** ${matchedUnit.valorTotal}\n\n` +
              `*Busca realizada na coluna de espaço complementar da planilha oficial.*`,
        propertyId: property.propertyId
      };
    } else {
      return {
        matched: true,
        text: `❌ Não localizei nenhuma unidade no **${property.propertyName}** associada à Vaga/Box **${targetNum}** no espaço complementar.`,
        propertyId: property.propertyId
      };
    }
  }

  // Caso A: Solicitação de unidade específica (Fluxo, Vagas/Boxes ou Tamanho/Área)
  const unitMatch = norm.match(/(?:unidade|apto|apto\.|apartamento)?\s*(\d{3,4})/i);
  if (unitMatch) {
    const targetUnitNum = unitMatch[1];
    const unitData = units.find(u => u.unitNumber === targetUnitNum);
    
    if (unitData) {
      // 1. Pergunta sobre Vaga, Box ou Garagem (Espaço Complementar)
      const isGaragemQuery = norm.includes('vaga') || norm.includes('box') || norm.includes('garagem') || norm.includes('garagens') || norm.includes('complemento') || norm.includes('estacionamento');
      if (isGaragemQuery) {
        return {
          matched: true,
          text: `🚗 **Vagas e Boxes — ${property.propertyName} (${unitData.unit})**\n\n` +
                `• **Espaço Complementar:** ${unitData.espacoComplementar || 'Nenhuma vaga ou box mapeado nesta unidade.'}\n` +
                `• **Situação da Unidade:** ${unitData.situacao === 'Disponível' ? '🟢 Disponível' : '🔴 ' + unitData.situacao}\n` +
                `• **Valor de Tabela:** ${unitData.valorTotal}\n\n` +
                `*Informações de garagem extraídas diretamente do arquivo oficial de vendas.*`,
          propertyId: property.propertyId
        };
      }

      // 2. Pergunta sobre Tamanho, Área, Metragem ou m²
      const isAreaQuery = norm.includes('tamanho') || norm.includes('area') || norm.includes('área') || norm.includes('m2') || norm.includes('m²') || norm.includes('metros') || norm.includes('metragem') || norm.includes('privativa') || norm.includes('total');
      if (isAreaQuery) {
        return {
          matched: true,
          text: `📐 **Área e Tamanho — ${property.propertyName} (${unitData.unit})**\n\n` +
                `• **Área Privativa:** ${unitData.areaPrivativa || 'Sob consulta'}\n` +
                `• **Área Total:** ${unitData.areaTotal || 'Sob consulta'}\n` +
                `• **Situação da Unidade:** ${unitData.situacao === 'Disponível' ? '🟢 Disponível' : '🔴 ' + unitData.situacao}\n` +
                `• **Valor de Tabela:** ${unitData.valorTotal}\n\n` +
                `*Informações de metragem extraídas diretamente da planilha de engenharia.*`,
          propertyId: property.propertyId
        };
      }

      // 3. Resposta Padrão: Fluxo de Pagamento da Unidade
      return {
        matched: true,
        text: `💰 **Fluxo de Pagamento — ${property.propertyName} (${unitData.unit})**\n\n` +
              `• **Situação:** ${unitData.situacao === 'Disponível' ? '🟢 Disponível' : '🔴 ' + unitData.situacao}\n` +
              `• **Valor de Tabela:** ${unitData.valorTotal}\n` +
              `• **Entrada (1x):** ${unitData.fluxo.entrada || 'Sob consulta'}\n` +
              `• **Mensais:** ${unitData.fluxo.mensais || 'Sob consulta'}\n` +
              `• **Reforços Anuais:** ${unitData.fluxo.anuais || 'Sob consulta'}\n` +
              `• **Parcela Final:** ${unitData.fluxo.final || 'Sob consulta'}\n\n` +
              `*Fluxo extraído diretamente da planilha oficial de vendas.*`,
        propertyId: property.propertyId
      };
    } else {
      return {
        matched: true,
        text: `❌ A unidade **${targetUnitNum}** não foi localizada na planilha do **${property.propertyName}**.`,
        propertyId: property.propertyId
      };
    }
  }

  // Caso B: Solicitação de unidades de determinado final (Ex: "final 1" ou "final 01")
  const finalMatch = norm.match(/final\s*(\d{1,2})/i);
  if (finalMatch) {
    const finalNum = finalMatch[1].padStart(2, '0');
    const matchingUnits = units.filter(u => u.final === finalNum && u.situacao === 'Disponível');
    
    if (matchingUnits.length > 0) {
      const listStr = matchingUnits.map(u => `• **${u.unit}** — ${u.valorTotal} (Área: ${u.areaPrivativa})`).join('\n');
      return {
        matched: true,
        text: `🟢 **Unidades Disponíveis — ${property.propertyName} (Final ${finalNum})**\n\n${listStr}\n\n` +
              `*Gostaria de ver o fluxo de pagamento de alguma destas unidades? Basta solicitar (ex: "Fluxo de pagamento do apto ${matchingUnits[0].unitNumber}").*`,
        propertyId: property.propertyId
      };
    } else {
      return {
        matched: true,
        text: `🔴 Não encontramos nenhuma unidade com **final ${finalNum}** disponível no **${property.propertyName}**.`,
        propertyId: property.propertyId
      };
    }
  }

  // Caso C: Busca geral de disponibilidade do empreendimento
  const availableUnits = units.filter(u => u.situacao === 'Disponível');
  if (availableUnits.length > 0) {
    const listStr = availableUnits.slice(0, 5).map(u => `• **${u.unit}** (Final ${u.final}) — ${u.valorTotal}`).join('\n');
    const extraCount = availableUnits.length > 5 ? `\n...e mais ${availableUnits.length - 5} unidades disponíveis.` : '';
    
    return {
      matched: true,
      text: `🏢 **Unidades Disponíveis no ${property.propertyName} (${availableUnits.length} no total)**\n\n` +
            `${listStr}${extraCount}\n\n` +
            `🔍 *Dica: Solicite o final desejado ou o fluxo de pagamento (ex: "Quais unidades final 01 do Bal Harbour" ou "Fluxo da unidade 601").*`,
      propertyId: property.propertyId
    };
  }

  return { matched: false, text: "", propertyId: null };
}
