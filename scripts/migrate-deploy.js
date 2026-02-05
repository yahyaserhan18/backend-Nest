'use strict';
require('dotenv').config();

require('child_process').execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: process.env,
});
