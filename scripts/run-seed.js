'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const db = process.env.DB_NAME;
  if (!host || !user || password === undefined || !db) {
    throw new Error('Set DATABASE_URL or DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME');
  }
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
}

process.env.DATABASE_URL = getDatabaseUrl();

require('child_process').execSync('npx ts-node prisma/seed.ts', {
  stdio: 'inherit',
  env: process.env,
  cwd: require('path').resolve(__dirname, '..'),
});
