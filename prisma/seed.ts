/**
 * Prisma seed: creates Users, Teachers, Students, Courses and enrollments.
 * Run with: npx prisma db seed (invoked via scripts/run-seed.js which sets DATABASE_URL).
 * Prisma 7 requires an adapter; we use @prisma/adapter-pg with the connection string.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL must be set (e.g. by scripts/run-seed.js)');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SEED_PASSWORD = 'SeedPassword1!';
const TEACHER_1_ID = 'a1000000-0000-4000-8000-000000000001';
const TEACHER_2_ID = 'a1000000-0000-4000-8000-000000000002';

const teachersData = [
  { id: TEACHER_1_ID, fullName: 'Dr. Jane Smith', email: 'jane.smith@school.edu' },
  { id: TEACHER_2_ID, fullName: 'Prof. John Doe', email: 'john.doe@school.edu' },
];

const coursesData = [
  { id: 'b2000000-0000-4000-8000-000000000001', title: 'Mathematics 101', code: 'MATH101', teacherId: TEACHER_1_ID },
  { id: 'b2000000-0000-4000-8000-000000000002', title: 'Physics 101', code: 'PHYS101', teacherId: TEACHER_1_ID },
  { id: 'b2000000-0000-4000-8000-000000000003', title: 'Introduction to Programming', code: 'CS101', teacherId: TEACHER_2_ID },
  { id: 'b2000000-0000-4000-8000-000000000004', title: 'Database Systems', code: 'CS201', teacherId: TEACHER_2_ID },
];

const studentsData: { id: string; name: string; age: number; grade: number; isActive: boolean }[] = [
  { id: '3b1d8c6a-8c3a-4a3f-9b0c-7e3d2c5c8f11', name: 'Ali', age: 20, grade: 75, isActive: true },
  { id: 'f2ad3a0c-1f3a-4f0b-9f4a-9a4c0d2a9b21', name: 'Ahmad', age: 22, grade: 45, isActive: true },
  { id: '9c3a1d7e-3d2b-4c1a-9e2c-1c2b3a4d5e66', name: 'Sara', age: 19, grade: 88, isActive: true },
  { id: 'b1a2c3d4-e5f6-47a8-9b1c-2d3e4f5a6b77', name: 'Khalid', age: 21, grade: 61, isActive: false },
  { id: 'a9b8c7d6-e5f4-43a2-9b8c-7d6e5f4a3b22', name: 'Mona', age: 23, grade: 93, isActive: true },
  { id: 'cc12aa34-bb56-4d78-9e10-112233445566', name: 'Omar', age: 18, grade: 50, isActive: true },
  { id: 'dd11cc22-ee33-4f44-8a55-667788990011', name: 'Lina', age: 20, grade: 70, isActive: true },
  { id: 'ee99ff88-aa77-4b66-9c55-4433221100aa', name: 'Hadi', age: 24, grade: 40, isActive: false },
  { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Noor', age: 21, grade: 84, isActive: true },
  { id: '987e6543-e21b-45d3-b321-123456789abc', name: 'Yahya', age: 22, grade: 99, isActive: true },
];

async function main() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Seed skipped: database already has data.');
    return;
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // 1. Users + Teachers
  for (const t of teachersData) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        passwordHash,
        role: Role.TEACHER,
        isActive: true,
      },
    });
    await prisma.teacher.create({
      data: {
        id: t.id,
        userId: user.id,
        fullName: t.fullName,
        email: t.email,
      },
    });
  }

  // 2. Courses
  for (const c of coursesData) {
    await prisma.course.create({
      data: {
        id: c.id,
        title: c.title,
        code: c.code,
        teacherId: c.teacherId,
      },
    });
  }

  // 3. Users + Students
  for (const s of studentsData) {
    const email = `student-${s.id}@seed.local`;
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: Role.STUDENT,
        isActive: true,
      },
    });
    await prisma.student.create({
      data: {
        id: s.id,
        userId: user.id,
        name: s.name,
        age: s.age,
        grade: s.grade,
        isActive: s.isActive,
      },
    });
  }

  // 4. Enrollments (connect first 6 students to courses in a round-robin)
  const courseIds = coursesData.map((c) => c.id);
  const studentIds = studentsData.map((s) => s.id);
  for (let i = 0; i < Math.min(6, studentIds.length); i++) {
    const courseId = courseIds[i % courseIds.length];
    const studentId = studentIds[i];
    await prisma.course.update({
      where: { id: courseId },
      data: { students: { connect: { id: studentId } } },
    });
  }

  console.log('Seed completed: users, teachers, courses, students, enrollments.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
