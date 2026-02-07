'use strict';

const { execSync } = require('child_process');
const { ensureDatabaseUrl, projectRoot } = require('./_db');

ensureDatabaseUrl();

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: process.env,
  cwd: projectRoot(),
});
