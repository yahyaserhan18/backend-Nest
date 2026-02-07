'use strict';

const { execSync } = require('child_process');
const { ensureDatabaseUrl, projectRoot } = require('./_db');

ensureDatabaseUrl();

if (process.argv[2] === 'generate') {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env,
    cwd: projectRoot(),
  });
}
