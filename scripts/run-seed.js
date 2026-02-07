'use strict';

const { execSync } = require('child_process');
const { ensureDatabaseUrl, projectRoot } = require('./_db');

ensureDatabaseUrl();

execSync('npx ts-node prisma/seed.ts', {
  stdio: 'inherit',
  env: process.env,
  cwd: projectRoot(),
});
