import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServerPath)) {
  await import('./dist/server.cjs');
} else {
  console.error('[Hostinger / Production Start] Error: dist/server.cjs no fue encontrado. Asegúrate de ejecutar "npm run build" antes de iniciar la aplicación.');
  process.exit(1);
}
