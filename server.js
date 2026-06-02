import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE  = join(__dirname, 'data.json');
const PORT       = process.env.PORT || 3001;
const PASSWORD   = process.env.ADMIN_PASSWORD || 'admin123';

const app = express();

// Allow Vite dev server and same-origin requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '1mb' }));

// ── Serve built frontend in production ─────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')));

// ── GET /api/data  — public ─────────────────────────────────────────────────
app.get('/api/data', (_req, res) => {
  try {
    res.json(JSON.parse(readFileSync(DATA_FILE, 'utf8')));
  } catch (err) {
    console.error('Read error:', err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// ── POST /api/data  — password protected ────────────────────────────────────
app.post('/api/data', (req, res) => {
  if (req.headers['x-admin-password'] !== PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error('Write error:', err);
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// ── SPA fallback (production) ────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀  CV Server  →  http://localhost:${PORT}`);
  console.log(`🔐  Admin password: "${PASSWORD}"`);
  console.log(`    (set ADMIN_PASSWORD env var to change)\n`);
});
