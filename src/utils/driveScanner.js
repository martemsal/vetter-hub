// Scanner Oficial do Google Drive em Tempo Real - Vetter Hub
// Sincroniza Apresentações e Tabelas de Vendas diretamente das pastas vivas do Drive.
import { INITIAL_DRIVE_INDEX, saveStoredDriveIndex } from '../data/driveIndex';

const APRESENTACAO_FOLDER_ID = '1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy';
const TABELA_FOLDER_ID = '1LbjGFcq9CsiwQCpc-pCJ1z9NvPLj8y1O';

function decodeHexEscapes(str) {
  try {
    return str.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    }).replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    }).replace(/\\/g, '');
  } catch (e) {
    return str;
  }
}

async function fetchDriveFolderItems(folderId, folderName) {
  const targetUrl = `https://drive.google.com/drive/folders/${folderId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Proxy indisponível');
    const html = await res.text();
    
    const match = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
    if (match) {
      const decoded = decodeHexEscapes(match[1]);
      
      // Capturar todos os arquivos no formato ["ID", ["PARENT_ID"], "TITLE", "MIMETYPE", ...]
      const pattern = /\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"/g;
      const results = [];
      let m;
      
      while ((m = pattern.exec(decoded)) !== null) {
        const item_id = m[1];
        const title = m[3];
        const mime = m[4];
        const isFolder = mime.includes('folder');
        if (!isFolder && (title.toLowerCase().endsWith('.pdf') || title.toLowerCase().endsWith('.csv') || title.toLowerCase().endsWith('.xlsx'))) {
          results.push({ id: item_id, title, mime, isFolder: false });
        }
      }
      
      // Fallback regex se o formato for ligeiramente diferente
      if (results.length === 0) {
        const fallbackPattern = /\["([a-zA-Z0-9_\-]+)",\["[^"]+"\]\s*,\s*"([^"]+)"/g;
        while ((m = fallbackPattern.exec(decoded)) !== null) {
          const item_id = m[1];
          const title = m[2];
          if (title.toLowerCase().endsWith('.pdf')) {
            results.push({ id: item_id, title, mime: 'application/pdf', isFolder: false });
          }
        }
      }
      
      return results;
    }
  } catch (err) {
    console.warn(`Aviso: Scanner em tempo real da pasta ${folderName} em background:`, err.message);
  }
  return [];
}

export async function runRealtimeDriveScanner() {
  console.log('Iniciando varredura em tempo real no Google Drive...');
  
  try {
    const [presentationItems, tableItems] = await Promise.all([
      fetchDriveFolderItems(APRESENTACAO_FOLDER_ID, 'Apresentação'),
      fetchDriveFolderItems(TABELA_FOLDER_ID, 'Tabela')
    ]);
    
    const allScannedItems = [...presentationItems, ...tableItems];
    
    if (allScannedItems.length === 0) {
      console.log('Mantendo o acervo sincronizado oficial de Setembro/2026.');
      return INITIAL_DRIVE_INDEX;
    }
    
    // Mesclar dados escaneados em tempo real com metadados
    const updatedIndex = allScannedItems.map(item => {
      const isTable = item.title.toLowerCase().includes('tabela') || item.title.toLowerCase().includes('preço') || item.title.toLowerCase().includes('preco');
      const category = isTable ? 'tabela' : 'book';
      
      const cleanTitle = item.title
        .replace(/\.pdf$/i, '')
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .replace(/Tabela /i, '')
        .replace(/ - Setembro 266/i, '')
        .replace(/ - Setembro 26/i, '')
        .replace(/ - Setembro 2026/i, '')
        .replace(/ - Agosto 2026/i, '')
        .replace(/Apresentação Comercial/i, '')
        .replace(/Apresentação lançamento/i, '')
        .replace(/Apresentação comercial/i, '')
        .replace(/Catálogo Digital WhatsApp/i, '')
        .trim();
        
      const propertyName = cleanTitle.split(' - ')[0].split(' _ ')[0].split('_')[0].trim() || 'Vetter';
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
          `tabela do ${propertyName.toLowerCase()}`,
          `tabela ${propertyName.toLowerCase()}`,
          `apresentação ${propertyName.toLowerCase()}`,
          `apresentacao ${propertyName.toLowerCase()}`
        ],
        title: item.title.replace(/\.pdf$/i, ''),
        type: 'pdf',
        category,
        size: '2.8 MB',
        updatedAt: 'Sincronizado em Tempo Real',
        url: `https://drive.google.com/uc?export=download&id=${item.id}`,
        viewUrl: `https://drive.google.com/file/d/${item.id}/view?usp=sharing`
      };
    });

    saveStoredDriveIndex(updatedIndex);
    console.log(`Varredura concluída! ${updatedIndex.length} arquivos sincronizados com o Google Drive.`);
    return updatedIndex;
  } catch (err) {
    console.warn('Erro na sincronização:', err);
    return INITIAL_DRIVE_INDEX;
  }
}
