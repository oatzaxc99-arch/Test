const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const KEYS_FILE = path.join(DATA_DIR, 'keys.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(KEYS_FILE)) {
  fs.writeFileSync(KEYS_FILE, JSON.stringify({ keys: [] }, null, 2));
}

app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function readKeys() {
  try {
    const parsed = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
    return Array.isArray(parsed.keys) ? parsed.keys : [];
  } catch {
    return [];
  }
}

function writeKeys(keys) {
  fs.writeFileSync(KEYS_FILE, JSON.stringify({ keys }, null, 2));
}

function isKeyValid(record) {
  if (!record || !record.active) return false;
  if (!record.expiresAt) return true;
  return Date.now() < new Date(record.expiresAt).getTime();
}

function generateKey() {
  const raw = crypto.randomBytes(9).toString('base64url').toUpperCase();
  return `KEY-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

app.post('/api/verify-key', (req, res) => {
  const input = String(req.body?.key || '').trim().toUpperCase();
  const record = readKeys().find((k) => k.key.toUpperCase() === input);

  if (!isKeyValid(record)) {
    return res.status(401).json({ ok: false, message: 'คีย์ไม่ถูกต้องหรือหมดอายุ' });
  }

  res.json({
    ok: true,
    key: record.key,
    expiresAt: record.expiresAt
  });
});

// Demo/admin endpoint. Protect this in production with your own admin auth.
app.get('/api/keys', (_req, res) => {
  const keys = readKeys().map(({ key, active, expiresAt, createdAt }) => ({
    key, active, expiresAt, createdAt
  }));
  res.json({ keys });
});

app.post('/api/keys', (req, res) => {
  const days = Number(req.body?.days ?? 30);
  if (!Number.isFinite(days) || days < 0 || days > 3650) {
    return res.status(400).json({ ok: false, message: 'days ต้องอยู่ระหว่าง 0 ถึง 3650' });
  }

  const keys = readKeys();
  let key = generateKey();
  while (keys.some((k) => k.key === key)) key = generateKey();

  const expiresAt = days === 0
    ? null
    : new Date(Date.now() + days * 86400000).toISOString();

  const record = {
    key,
    active: true,
    expiresAt,
    createdAt: new Date().toISOString()
  };

  keys.push(record);
  writeKeys(keys);
  res.json({ ok: true, record });
});

app.post('/api/keys/toggle', (req, res) => {
  const key = String(req.body?.key || '').trim().toUpperCase();
  const keys = readKeys();
  const record = keys.find((k) => k.key.toUpperCase() === key);
  if (!record) return res.status(404).json({ ok: false, message: 'ไม่พบคีย์' });
  record.active = !record.active;
  writeKeys(keys);
  res.json({ ok: true, record });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, message: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Music Web V1 running at http://localhost:${PORT}`);
});
