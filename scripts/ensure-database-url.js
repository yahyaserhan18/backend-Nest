'use strict';
require('dotenv').config();

if (process.argv[2] === 'generate') {
  require('child_process').execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env,
  });
}
