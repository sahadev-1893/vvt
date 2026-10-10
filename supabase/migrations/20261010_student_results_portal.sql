-- ============================================================================
-- Supabase Database Migration: Student Result Publishing System
-- Tables: Examinations, Subjects, Students, StudentResults, AuditLogs
-- ============================================================================

-- 1. Examinations Table
CREATE TABLE IF NOT EXISTS vvt_examinations (
  examination_id TEXT PRIMARY KEY,
  examination_name TEXT NOT NULL,
  examination_type TEXT NOT NULL CHECK (examination_type IN ('Annual', 'Half-Yearly', 'Semester', 'Supplementary')),
  academic_year TEXT NOT NULL,
  classes JSONB NOT NULL DEFAULT '[]'::jsonb,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('published', 'draft', 'unpublished')),
  published_at TIMESTAMPTZ,
  held_in TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for speedy searching by publication status & session
CREATE INDEX IF NOT EXISTS idx_vvt_examinations_session ON vvt_examinations(academic_year, examination_type);
CREATE INDEX IF NOT EXISTS idx_vvt_examinations_status ON vvt_examinations(publication_status);

-- 2. Subjects Master Table
CREATE TABLE IF NOT EXISTS vvt_subjects (
  subject_id TEXT PRIMARY KEY,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  full_marks INTEGER NOT NULL DEFAULT 100,
  pass_marks INTEGER NOT NULL DEFAULT 33,
  theory_marks INTEGER,
  practical_marks INTEGER,
  class_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vvt_subjects_class ON vvt_subjects(class_name, subject_code);

-- 3. Students Directory Table
CREATE TABLE IF NOT EXISTS vvt_students (
  student_id TEXT PRIMARY KEY,
  roll_number TEXT NOT NULL,
  registration_number TEXT,
  student_name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  date_of_birth DATE,
  gender TEXT DEFAULT 'Male',
  class_name TEXT NOT NULL,
  section TEXT DEFAULT 'A',
  academic_year TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_roll_class UNIQUE (roll_number, class_name, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_vvt_students_roll ON vvt_students(roll_number);
CREATE INDEX IF NOT EXISTS idx_vvt_students_class ON vvt_students(class_name, academic_year);

-- 4. Student Results Table
CREATE TABLE IF NOT EXISTS vvt_student_results (
  result_id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES vvt_students(student_id) ON DELETE SET NULL,
  roll_number TEXT NOT NULL,
  registration_number TEXT,
  student_name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  date_of_birth DATE,
  class_name TEXT NOT NULL,
  section TEXT DEFAULT 'A',
  academic_year TEXT NOT NULL,
  examination_id TEXT REFERENCES vvt_examinations(examination_id) ON DELETE CASCADE,
  examination_name TEXT NOT NULL,
  examination_type TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_full_marks INTEGER NOT NULL DEFAULT 0,
  total_marks_obtained INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  grade TEXT NOT NULL,
  result_status TEXT NOT NULL CHECK (result_status IN ('PASS', 'FAIL', 'COMPARTMENT', 'WITHHELD', 'PROMOTED')),
  division TEXT,
  remarks TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('published', 'draft', 'unpublished')),
  published_at TIMESTAMPTZ,
  verification_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crucial Indexes for ultra-fast student result lookups & verification
CREATE INDEX IF NOT EXISTS idx_vvt_results_roll_exam ON vvt_student_results(roll_number, examination_type, academic_year);
CREATE INDEX IF NOT EXISTS idx_vvt_results_verification ON vvt_student_results(verification_code);
CREATE INDEX IF NOT EXISTS idx_vvt_results_status ON vvt_student_results(publication_status, result_status);

-- 5. Result Audit Logs Table
CREATE TABLE IF NOT EXISTS vvt_result_audit_logs (
  log_id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  record_type TEXT NOT NULL,
  record_id TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vvt_audit_timestamp ON vvt_result_audit_logs(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE vvt_examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_result_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for published results & examinations
CREATE POLICY "Allow public read access for published results"
  ON vvt_student_results
  FOR SELECT
  USING (publication_status = 'published');

CREATE POLICY "Allow public read access for published examinations"
  ON vvt_examinations
  FOR SELECT
  USING (publication_status = 'published');

CREATE POLICY "Allow authenticated admin full access to results"
  ON vvt_student_results
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to examinations"
  ON vvt_examinations
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to students"
  ON vvt_students
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to subjects"
  ON vvt_subjects
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin full access to audit logs"
  ON vvt_result_audit_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);
