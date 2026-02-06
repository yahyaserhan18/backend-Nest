-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'STUDENT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "refresh_token_hash" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddColumn teachers.user_id (nullable first)
ALTER TABLE "teachers" ADD COLUMN "user_id" UUID;

-- AddColumn students.user_id (nullable first)
ALTER TABLE "students" ADD COLUMN "user_id" UUID;

-- Backfill: create a user for each teacher and set teacher.user_id
DO $$
DECLARE
  r RECORD;
  new_user_id UUID;
  pwd_hash TEXT := '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
BEGIN
  FOR r IN SELECT "id", "email", "fullName" FROM "teachers"
  LOOP
    new_user_id := uuid_generate_v4();
    INSERT INTO "users" ("id", "email", "password_hash", "role", "is_active", "created_at", "updated_at")
    VALUES (new_user_id, r.email, pwd_hash, 'TEACHER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    UPDATE "teachers" SET "user_id" = new_user_id WHERE "id" = r.id;
  END LOOP;
END $$;

-- Backfill: create a user for each student and set student.user_id
DO $$
DECLARE
  r RECORD;
  new_user_id UUID;
  pwd_hash TEXT := '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  student_email VARCHAR(255);
BEGIN
  FOR r IN SELECT "id", "name", "age", "grade", "isActive", "createdAt" FROM "students"
  LOOP
    new_user_id := uuid_generate_v4();
    student_email := 'student-' || r.id::text || '@seed.local';
    INSERT INTO "users" ("id", "email", "password_hash", "role", "is_active", "created_at", "updated_at")
    VALUES (new_user_id, student_email, pwd_hash, 'STUDENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    UPDATE "students" SET "user_id" = new_user_id WHERE "id" = r.id;
  END LOOP;
END $$;

-- Make user_id NOT NULL and add constraints
ALTER TABLE "teachers" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "students" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
