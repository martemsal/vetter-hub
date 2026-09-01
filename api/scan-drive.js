// Vercel Serverless Function - Scanner em Tempo Real do Google Drive
// Roda no backend da Vercel sem bloqueios de CORS e com latência ultra-baixa.

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

async function fetchFolderItems(folderId, folderName) {
  const targetUrl = `https://drive.google.com/drive/folders/${folderId}`;
  
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) return [];
    const html = await res.text();
    
    const match = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
    if (match) {
      const decoded = decodeHexEscapes(match[1]);
      
      const pattern = /\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"/g;
      const results = [];
      let m;
      
      while ((m = pattern.exec(decoded)) !== null) {
        const item_id = m[1];
        const title = m[3];
        const mime = m[4];
        const isFolder = mime.includes('folder');
        if (!isFolder && (title.toLowerCase().endsWith('.pdf') || title.toLowerCase().endsWith('.csv') || title.toLowerCase().endsWith('.xlsx'))) {
          results.push({ id: item_id, title, mime, folder: folderName });
        }
      }

      if (results.length === 0) {
        const fallbackPattern = /\["([a-zA-Z0-9_\-]+)",\["[^"]+"\]\s*,\s*"([^"]+)"/g;
        while ((m = fallbackPattern.exec(decoded)) !== null) {
          const item_id = m[1];
          const title = m[2];
          if (title.toLowerCase().endsWith('.pdf')) {
            results.push({ id: item_id, title, mime: 'application/pdf', folder: folderName });
          }
        }
      }
      
      return results;
    }
  } catch (err) {
    console.error(`Erro ao escanear pasta ${folderName}:`, err);
  }
  return [];
}

export default async function handler(req, res) {
  // Configurar cabeçalhos de CORS e Cache
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const [presentationItems, tableItems] = await Promise.all([
      fetchFolderItems(APRESENTACAO_FOLDER_ID, 'Apresentação'),
      fetchFolderItems(TABELA_FOLDER_ID, 'Tabela')
    ]);

    const allItems = [...presentationItems, ...tableItems];

    if (allItems.length === 0) {
      return res.status(200).json({ success: false, count: 0, files: [] });
    }

    const formattedFiles = allItems.map(item => {
      const isTable = item.folder === 'Tabela' || item.title.toLowerCase().includes('tabela');
      const category = isTable ? 'tabela' : 'book';
      
      const cleanTitle = item.title
        .replace(/\.pdf$/i, '')
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .replace(/Tabela /i, '')
        .replace(/Tabela de preÃ§os /i, '')
        .replace(/Tabela de preços /i, '')
        .replace(/ - Setembro 266/i, '')
        .replace(/ - Setembro 20266/i, '')
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
        folder: item.folder,
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

    return res.status(200).json({
      success: true,
      count: formattedFiles.length,
      files: formattedFiles,
      scannedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
