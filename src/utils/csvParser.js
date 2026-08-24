// Parser de CSV robusto para Disponibilidade de Unidades Vetter
import { AVAILABILITY_FILES } from '../data/availabilityIndex';

/**
 * Faz o download e analisa o arquivo CSV do Google Drive
 * @param {string} driveId - ID do arquivo no Google Drive
 * @returns {Promise<Array>} Lista de objetos estruturados por unidade
 */
export async function fetchAndParseAvailabilityCSV(driveId) {
  const targetUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Erro ao baixar CSV');
    const text = await res.text();
    return parseCSVContent(text);
  } catch (err) {
    console.error('Erro ao baixar/analisar CSV:', err);
    return [];
  }
}

/**
 * Analisa o conteúdo de texto do CSV em português
 * @param {string} csvText - Texto bruto do CSV
 * @returns {Array} Lista de unidades decodificadas
 */
export function parseCSVContent(csvText) {
  if (!csvText) return [];
  
  // Limpar BOM caractere se houver
  const cleanText = csvText.replace(/^\uFEFF/i, '').trim();
  
  // Separar por quebras de linha considerando aspas
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  // Encontrar o cabeçalho e registros de dados
  // O cabeçalho no Excel em português usa separador ';'
  // Como o cabeçalho pode estar quebrado em várias linhas, vamos mesclar as primeiras linhas até encontrarmos as colunas
  let headerLineIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('UNIDADE') && lines[i].includes('VALOR TOTAL')) {
      headerLineIndex = i;
      break;
    }
  }

  // Registros de dados (geralmente começam com "Apto." ou "Unidade")
  const rawDataLines = lines.slice(headerLineIndex + 1);
  const parsedUnits = [];

  for (const line of rawDataLines) {
    // Dividir a linha respeitando aspas
    const cols = [];
    let curCol = '';
    let inColQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inColQuotes = !inColQuotes;
      } else if (char === ';' && !inColQuotes) {
        cols.push(curCol.trim());
        curCol = '';
      } else {
        curCol += char;
      }
    }
    cols.push(curCol.trim());

    if (cols.length < 5 || !cols[0]) continue;

    const rawUnit = cols[0]; // Ex: "Apto. 601"
    const areaPrivativa = cols[1]?.replace(/[?]/g, 'a') || ''; // remove caracteres malformados como m?
    const areaTotal = cols[2]?.replace(/[?]/g, 'a') || '';
    const espacoComplementar = cols[3] || '';
    const situacaoRaw = cols[4] || '';
    
    // Normalizar situação
    let situacao = 'Indisponível';
    if (situacaoRaw.toLowerCase().includes('dispon')) {
      situacao = 'Disponível';
    } else if (situacaoRaw.toLowerCase().includes('vend')) {
      situacao = 'Vendida';
    } else if (situacaoRaw.toLowerCase().includes('bloq')) {
      situacao = 'Bloqueada';
    }

    const valorTotal = cols[5] || 'Consulte';
    const entrada = cols[6] || '';
    const parcelasMensais = cols[7] || '';
    const parcelasAnuais = cols[8] || '';
    const parcelaFinal = cols[9] || '';

    // Extrair número da unidade e final (Ex: "Apto. 601" -> unitNum: 601, final: 01)
    const unitMatch = rawUnit.match(/(\d+)$/);
    const unitNumber = unitMatch ? unitMatch[1] : '';
    const finalNumber = unitNumber ? unitNumber.slice(-2) : '';

    parsedUnits.push({
      unit: rawUnit,
      unitNumber,
      final: finalNumber,
      areaPrivativa,
      areaTotal,
      espacoComplementar,
      situacao,
      valorTotal,
      fluxo: {
        entrada,
        mensais: parcelasMensais,
        anuais: parcelasAnuais,
        final: parcelaFinal,
        total: valorTotal
      }
    });
  }

  return parsedUnits;
}
