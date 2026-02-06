'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const path = require('path');
const env = process.env;
function getDatabaseUrl() {
  if (env.DATABASE_URL?.trim()) return env.DATABASE_URL;
  const host = env.DB_HOST, port = env.DB_PORT || '5432', user = env.DB_USERNAME, password = env.DB_PASSWORD, db = env.DB_NAME;
  if (!host || !user || password === undefined || !db) throw new Error('Set DATABASE_URL or DB_*');
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
}
process.env.DATABASE_URL = getDatabaseUrl();

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function run() {
  const [users, teachers, students, courses] = await Promise.all([
    prisma.user.count(),
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.course.count(),
  ]);
  console.log('Counts: users=%d, teachers=%d, students=%d, courses=%d', users, teachers, students, courses);
  const sample = await prisma.teacher.findFirst({ include: { user: { select: { email: true, role: true } } } });
  console.log('Sample teacher:', sample?.fullName, '| user:', sample?.user?.email, sample?.user?.role);
  await prisma.$disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
