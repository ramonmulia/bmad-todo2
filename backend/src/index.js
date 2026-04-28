import { createApp } from './app.js';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3001;

// Ensure data directory exists
const dataDir = process.env.DB_PATH
  ? path.dirname(process.env.DB_PATH)
  : path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });

const app = createApp();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Todo API running on http://0.0.0.0:${PORT}`);
});

function shutdown() {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
