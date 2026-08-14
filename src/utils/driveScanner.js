// Scanner em Tempo Real do Google Drive para Frontend (Zero Config e Sem Chaves de API)
import { INITIAL_DRIVE_INDEX, saveStoredDriveIndex } from '../data/driveIndex';

const FOLDER_ID = '1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht';
const WAVE_FOLDER_ID = '1QtIVHODdXFFi85C_G94G95KLQ9A-txKk';
const TABELA_FOLDER_ID = '1LbjGFcq9CsiwQCpc-pCJ1z9NvPLj8y1O';
const APRESENTACAO_FOLDER_ID = '1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy';

// Decodifica strings com escapes hexadecimais (ex: \x5b -> [)
function decodeHexEscapes(str) {
  return str.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  }).replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  }).replace(/\\/g, '');
}

// Faz requisição a pastas do Drive usando Proxy CORS público e extrai itens
async function fetchDriveFolderItems(folderId, folderName) {
  // Tentamos usar CORSProxy.io ou AllOrigins de forma robusta com fallback
  const targetUrl = `https://drive.google.com/drive/folders/${folderId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Falha ao acessar proxy do Drive');
    const html = await res.text();
    
    // Captura window['_DRIVE_ivd'] que contém a lista de itens injetada pelo Drive
    const match = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
    if (match) {
      const decoded = decodeHexEscapes(match[1]);
      const cleanJson = decoded.substring(decoded.indexOf('[[')); // garante início do array JSON
      const parsed = JSON.parse(cleanJson);
      
      if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
        return parsed[0].map(item => {
          const id = item[0];
          const title = item[2];
          const mime = item[3];
          const isFolder = mime === 'application/vnd.google-apps.folder';
          return { id, title, mime, isFolder, folderName };
        });
      }
    }
  } catch (err) {
    console.warn(`Erro ao escanear pasta ${folderName}:`, err);
  }
  return [];
}

/**
 * Executa o escaneamento em tempo real de todas as tabelas e apresentações da pasta compartilhada
 * @returns {Promise<Array>} Lista de arquivos atualizados
 */
export async function runRealtimeDriveScanner() {
  console.log('Iniciando varredura em tempo real na pasta do Google Drive...');
  
  // 1. Escanear pasta de Apresentações
  const presentationItems = await fetchDriveFolderItems(APRESENTACAO_FOLDER_ID, 'The Wave / Apresentação');
  
  // 2. Escanear pasta de Tabelas
  const tableItems = await fetchDriveFolderItems(TABELA_FOLDER_ID, 'The Wave / Tabela');
  
  const allScannedItems = [...presentationItems, ...tableItems].filter(item => !item.isFolder);
  
  if (allScannedItems.length === 0) {
    console.log('Nenhum arquivo retornado do scanner do Drive. Usando índice local seguro.');
    return INITIAL_DRIVE_INDEX;
  }
  
  // 3. Mapear e estruturar no formato do nosso driveIndex
  const updatedIndex = allScannedItems.map(item => {
    const isTable = item.folderName.includes('Tabela');
    const category = isTable ? 'tabela' : 'book';
    
    // Normalizar nomes e aliases de empreendimentos
    const cleanTitle = item.title.replace(/\.pdf$/i, '').replace(/Tabela /i, '').replace(/ - Agosto 2026/i, '').trim();
    const propertyName = isTable ? cleanTitle : 'The Wave';
    const propertyId = propertyName.toLowerCase().replace(/\s+/g, '-');

    return {
      id: item.id,
      driveId: item.id,
      propertyName,
      propertyId,
      folder: item.folderName,
      name: item.title,
      aliases: [
        propertyName.toLowerCase(),
        `${category} ${propertyName.toLowerCase()}`,
        `tabela do ${propertyName.toLowerCase()}`
      ],
      title: isTable ? `Tabela ${propertyName} (Atualizada)` : `Apresentação Comercial ${propertyName}`,
      type: 'pdf',
      category,
      size: '2.5 MB',
      updatedAt: 'Sincronizado Agora',
      url: `https://drive.google.com/uc?export=download&id=${item.id}`,
      viewUrl: `https://drive.google.com/file/d/${item.id}/view?usp=sharing`
    };
  });

  // Salvar no LocalStorage para os próximos acessos
  saveStoredDriveIndex(updatedIndex);
  console.log(`Varredura concluída! ${updatedIndex.length} arquivos sincronizados em tempo real.`);
  return updatedIndex;
}
