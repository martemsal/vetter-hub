// Scanner Oficial do Google Drive em Tempo Real - Vetter Hub
import { INITIAL_DRIVE_INDEX, saveStoredDriveIndex } from '../data/driveIndex';

export async function runRealtimeDriveScanner() {
  console.log('Iniciando varredura em tempo real no Google Drive...');

  // 1. Tentar escanear via Serverless API nativa da Vercel (/api/scan-drive)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch('/api/scan-drive', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.files) && data.files.length > 0) {
        console.log(`Scanner Serverless Vercel: ${data.files.length} arquivos sincronizados com o Google Drive.`);
        saveStoredDriveIndex(data.files);
        return data.files;
      }
    }
  } catch (apiErr) {
    console.warn('Scanner Serverless indisponível no momento, tentando fallback:', apiErr.message);
  }

  // 2. Fallback: Ler do índice oficial sincronizado
  return INITIAL_DRIVE_INDEX;
}
