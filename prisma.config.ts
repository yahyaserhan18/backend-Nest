import 'dotenv/config';

import { getDatabaseUrl } from './src/config/database-url';
import { defineConfig, env } from 'prisma/config';

process.env.DATABASE_URL = getDatabaseUrl(process.env as Record<string, string | undefined>);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
