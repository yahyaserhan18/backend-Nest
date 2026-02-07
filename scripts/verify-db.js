'use strict';

const { ensureDatabaseUrl } = require('./_db');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

ensureDatabaseUrl();

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function run() {
  const [users, teachers, students, courses] = await Promise.all([
    prisma.user.count(),
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.course.count(),
  ]);
  console.log(
    'Counts: users=%d, teachers=%d, students=%d, courses=%d',
    users,
    teachers,
    students,
    courses
  );
  const sample = await prisma.teacher.findFirst({
    include: { user: { select: { email: true, role: true } } },
  });
  console.log(
    'Sample teacher:',
    sample?.fullName,
    '| user:',
    sample?.user?.email,
    sample?.user?.role
  );
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
