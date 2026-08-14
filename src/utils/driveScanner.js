// Scanner Oficial do Google Drive em Tempo Real (Pasta Litoral -> Apresentação e Tabela)
import { INITIAL_DRIVE_INDEX, saveStoredDriveIndex } from '../data/driveIndex';

const APRESENTACAO_FOLDER_ID = '1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy';
const TABELA_FOLDER_ID = '1LbjGFcq9CsiwQCpc-pCJ1z9NvPLj8y1O';

function decodeHexEscapes(str) {
  return str.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  }).replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  }).replace(/\\/g, '');
}

async function fetchDriveFolderItems(folderId, folderName) {
  const targetUrl = `https://drive.google.com/drive/folders/${folderId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Falha ao conectar ao proxy do Drive');
    const html = await res.text();
    
    const match = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
    if (match) {
      const decoded = decodeHexEscapes(match[1]);
      
      // Capturar todos os itens no formato ["ID", ["PARENT_ID"], "TITLE", "MIMETYPE", ...]
      const pattern = new RegExp(`\\["([a-zA-Z0-9_\\-]+)",\\["${folderId}"\\],"([^"]+)"\\s*,\\s*"([^"]+)"`, 'g');
      const results = [];
      let m;
      
      while ((m = pattern.exec(decoded)) !== null) {
        const item_id = m[1];
        const title = m[2];
        const mime = m[3];
        const isFolder = mime === 'application/vnd.google-apps.folder';
        results.append({ id: item_id, title, mime, isFolder });
      }
      
      // Fallback regex se o formato for ligeiramente diferente
      if (results.length === 0) {
        const fallbackPattern = /\["([a-zA-Z0-9_\-]+)",\["[^"]+"\]\s*,\s*"([^"]+)"/g;
        while ((m = fallbackPattern.exec(decoded)) !== null) {
          const item_id = m[1];
          const title = m[2];
          if (title.endsWith('.pdf') || title.endsWith('.jpg') || title.endsWith('.png') || title.endsWith('.xlsx')) {
            results.push({ id: item_id, title, mime: 'application/pdf', isFolder: false });
          }
        }
      }
      
      return results;
    }
  } catch (err) {
    console.warn(`Erro ao escanear pasta ${folderName}:`, err);
  }
  return [];
}

export async function runRealtimeDriveScanner() {
  console.log('Iniciando varredura em tempo real no Google Drive (Litoral)...');
  
  const presentationItems = await fetchDriveFolderItems(APRESENTACAO_FOLDER_ID, 'Apresentação');
  const tableItems = await fetchDriveFolderItems(TABELA_FOLDER_ID, 'Tabela');
  
  const allScannedItems = [...presentationItems, ...tableItems];
  
  if (allScannedItems.length === 0) {
    console.log('Nenhum arquivo retornado do scanner do Drive. Usando índice estático robusto.');
    return INITIAL_DRIVE_INDEX;
  }
  
  // Mesclar dados escaneados com metadados do acervo estático
  const updatedIndex = allScannedItems.map(item => {
    const isTable = item.title.toLowerCase().includes('tabela') || item.title.toLowerCase().includes('preço') || item.title.toLowerCase().includes('preco');
    const category = isTable ? 'tabela' : 'book';
    
    // Tenta encontrar correspondente no índice estático para puxar aliases ricos
    const matchedStatic = INITIAL_DRIVE_INDEX.find(si => si.id === item.id || si.name === item.title);
    
    if (matchedStatic) {
      return {
        ...matchedStatic,
        updatedAt: 'Sincronizado Agora'
      };
    }
    
    // Cria novo item se não existia no índice estático
    const cleanTitle = item.title
      .replace(/\.pdf$/i, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .replace(/Tabela /i, '')
      .replace(/ - Agosto 2026/i, '')
      .trim();
      
    const propertyName = cleanTitle.split(' - ')[0].split(' _ ')[0].trim();
    const propertyId = propertyName.toLowerCase().replace(/\s+/g, '-');

    return {
      id: item.id,
      driveId: item.id,
      propertyName,
      propertyId,
      folder: isTable ? 'Tabela' : 'Apresentação',
      name: item.title,
      aliases: [
        propertyName.toLowerCase(),
        `${category} ${propertyName.toLowerCase()}`,
        `tabela do ${propertyName.toLowerCase()}`
      ],
      title: item.title.replace(/\.pdf$/i, ''),
      type: 'pdf',
      category,
      size: '2.5 MB',
      updatedAt: 'Sincronizado Agora',
      url: `https://drive.google.com/uc?export=download&id=${item.id}`,
      viewUrl: `https://drive.google.com/file/d/${item.id}/view?usp=sharing`
    };
  });

  saveStoredDriveIndex(updatedIndex);
  console.log(`Varredura concluída! ${updatedIndex.length} arquivos sincronizados em tempo real.`);
  return updatedIndex;
}
