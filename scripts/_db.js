'use strict';

const path = require('path');

/** Project root (directory containing package.json). */
function projectRoot() {
  return path.resolve(__dirname, '..');
}

/** Load .env from project root. Idempotent; safe to call multiple times. */
function loadEnv() {
  require('dotenv').config({ path: path.join(projectRoot(), '.env') });
}

/**
 * Ensures process.env.DATABASE_URL is set.
 * Uses DATABASE_URL if present; otherwise builds from DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
 * (user/password are encoded with encodeURIComponent).
 * @returns {string} The resolved DATABASE_URL
 */
function ensureDatabaseUrl() {
  loadEnv();
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    process.env.DATABASE_URL = url;
    return url;
  }
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const db = process.env.DB_NAME;
  if (!host || !user || password === undefined || !db) {
    throw new Error(
      'Set DATABASE_URL or DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME'
    );
  }
  const built = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
  process.env.DATABASE_URL = built;
  return built;
}

module.exports = { ensureDatabaseUrl, projectRoot, loadEnv };
