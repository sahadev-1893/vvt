import { createClient } from '@supabase/supabase-js';

// Provided by user for Vishwa Vinayak Trust database storage:
// Project id: heeevwvzlleubaikuoua
// API key: sb_publishable_BtA0870_-meAkitRQKP0KQ_2lnBS_Dh
export const SUPABASE_PROJECT_ID = 'heeevwvzlleubaikuoua';
export const SUPABASE_URL =
  (import.meta.env?.VITE_SUPABASE_URL as string) ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_BtA0870_-meAkitRQKP0KQ_2lnBS_Dh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_TABLES = {
  WINGS: 'vvt_wings',
  EXPERTS: 'vvt_experts',
  SLIDERS: 'vvt_sliders',
  NOTICES: 'vvt_notices',
  EVENTS: 'vvt_events',
  GALLERY: 'vvt_gallery',
  APPLICATIONS: 'vvt_applications',
  ENQUIRIES: 'vvt_enquiries',
  ADMINS: 'vvt_admins',
  SETTINGS: 'vvt_settings',
  LOGS: 'vvt_logs',
  STUDENT_RESULTS: 'vvt_student_results',
  EXAMINATIONS: 'vvt_examinations',
  SUBJECTS: 'vvt_subjects',
  STUDENTS: 'vvt_students',
  RESULT_AUDIT: 'vvt_result_audit_logs',
};

// SQL Schema for the user to execute in Supabase SQL Editor if creating tables
export const SUPABASE_SQL_SCHEMA = `-- Vishwa Vinayak Trust Group of Institutions Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql

-- 1. Academic Wings
CREATE TABLE IF NOT EXISTS vvt_wings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  "shortName" TEXT NOT NULL,
  tagline TEXT,
  "coverImage" TEXT,
  description TEXT,
  "aboutText" TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  "principalName" TEXT,
  "principalQualification" TEXT,
  "principalMessage" TEXT,
  "establishedYear" INTEGER,
  affiliation TEXT,
  "campusArea" TEXT,
  "studentCount" INTEGER,
  "facultyCount" INTEGER,
  facilities JSONB DEFAULT '[]'::jsonb,
  courses JSONB DEFAULT '[]'::jsonb,
  "admissionInfo" TEXT,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hero Sliders
CREATE TABLE IF NOT EXISTS vvt_sliders (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  heading TEXT NOT NULL,
  subheading TEXT,
  description TEXT,
  "buttonText" TEXT,
  "buttonUrl" TEXT,
  "order" INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notices & Circulars
CREATE TABLE IF NOT EXISTS vvt_notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "noticeDate" TEXT NOT NULL,
  category TEXT NOT NULL,
  "shortDescription" TEXT,
  "fullContent" TEXT,
  "attachmentUrl" TEXT,
  "attachmentName" TEXT,
  "attachmentType" TEXT DEFAULT 'none',
  "attachmentSize" TEXT,
  "isImportant" BOOLEAN DEFAULT false,
  "isNew" BOOLEAN DEFAULT true,
  "wingId" TEXT DEFAULT 'all',
  status TEXT DEFAULT 'published',
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events & Activities
CREATE TABLE IF NOT EXISTS vvt_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "eventDate" TEXT NOT NULL,
  "startTime" TEXT,
  "endTime" TEXT,
  venue TEXT NOT NULL,
  "wingId" TEXT DEFAULT 'all',
  description TEXT,
  "fullContent" TEXT,
  "registrationUrl" TEXT,
  status TEXT DEFAULT 'upcoming',
  "coverImage" TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  "isPublished" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Photo Gallery Albums
CREATE TABLE IF NOT EXISTS vvt_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "wingId" TEXT DEFAULT 'all',
  category TEXT DEFAULT 'Campus',
  "coverPhoto" TEXT,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  "isPublished" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Career / CV Applications (User Upload Details)
CREATE TABLE IF NOT EXISTS vvt_applications (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT UNIQUE NOT NULL,
  "fullName" TEXT NOT NULL,
  "parentName" TEXT,
  dob TEXT,
  gender TEXT,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  qualification TEXT NOT NULL,
  experience TEXT,
  skills TEXT,
  "applyingFor" TEXT NOT NULL,
  "preferredWingId" TEXT DEFAULT 'all',
  message TEXT,
  "cvFileName" TEXT,
  "cvFileType" TEXT,
  "cvFileSize" TEXT,
  "cvFileData" TEXT, -- Stores data payload / URL
  status TEXT DEFAULT 'new',
  "adminRemarks" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Contact Enquiries
CREATE TABLE IF NOT EXISTS vvt_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  "replyNotes" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Administrators & Staff
CREATE TABLE IF NOT EXISTS vvt_admins (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  role TEXT DEFAULT 'editor',
  status TEXT DEFAULT 'active',
  "passwordHash" TEXT,
  "lastLogin" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Site Settings
CREATE TABLE IF NOT EXISTS vvt_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_settings',
  data JSONB NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Activity Logs
CREATE TABLE IF NOT EXISTS vvt_logs (
  id TEXT PRIMARY KEY,
  "adminName" TEXT,
  "adminEmail" TEXT,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  "recordTitle" TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Faculty & Academic Experts
CREATE TABLE IF NOT EXISTS vvt_experts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  "wingId" TEXT DEFAULT 'all',
  qualification TEXT NOT NULL,
  experience TEXT,
  specialization TEXT,
  bio TEXT,
  photo TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  "order" INTEGER DEFAULT 1,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Allow public read/insert for trust website
ALTER TABLE vvt_wings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vvt_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON vvt_wings FOR SELECT USING (true);
CREATE POLICY "Public Read Experts" ON vvt_experts FOR SELECT USING (true);
CREATE POLICY "Public Read Sliders" ON vvt_sliders FOR SELECT USING (true);
CREATE POLICY "Public Read Notices" ON vvt_notices FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON vvt_events FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON vvt_gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON vvt_settings FOR SELECT USING (true);

-- Allow public inserts for Contact Enquiries and Career CV Applications
CREATE POLICY "Public Submit Enquiries" ON vvt_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Submit Applications" ON vvt_applications FOR INSERT WITH CHECK (true);

-- Allow all operations for anon/authenticated in demo context
CREATE POLICY "Anon Full Access Wings" ON vvt_wings FOR ALL USING (true);
CREATE POLICY "Anon Full Access Experts" ON vvt_experts FOR ALL USING (true);
CREATE POLICY "Anon Full Access Sliders" ON vvt_sliders FOR ALL USING (true);
CREATE POLICY "Anon Full Access Notices" ON vvt_notices FOR ALL USING (true);
CREATE POLICY "Anon Full Access Events" ON vvt_events FOR ALL USING (true);
CREATE POLICY "Anon Full Access Gallery" ON vvt_gallery FOR ALL USING (true);
CREATE POLICY "Anon Full Access Applications" ON vvt_applications FOR ALL USING (true);
CREATE POLICY "Anon Full Access Enquiries" ON vvt_enquiries FOR ALL USING (true);
CREATE POLICY "Anon Full Access Admins" ON vvt_admins FOR ALL USING (true);
CREATE POLICY "Anon Full Access Settings" ON vvt_settings FOR ALL USING (true);
CREATE POLICY "Anon Full Access Logs" ON vvt_logs FOR ALL USING (true);
`;

// Helper to check connection status
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  tablesFound: string[];
}> {
  try {
    const tablesFound: string[] = [];
    const checkTables = [
      SUPABASE_TABLES.WINGS,
      SUPABASE_TABLES.EXPERTS,
      SUPABASE_TABLES.NOTICES,
      SUPABASE_TABLES.EVENTS,
      SUPABASE_TABLES.APPLICATIONS,
      SUPABASE_TABLES.ENQUIRIES,
    ];

    for (const tbl of checkTables) {
      const { error } = await supabase.from(tbl).select('id').limit(1);
      if (!error) {
        tablesFound.push(tbl);
      }
    }

    if (tablesFound.length > 0) {
      return {
        connected: true,
        message: `Successfully connected to Supabase (${tablesFound.length} tables active)`,
        tablesFound,
      };
    }

    // Try a ping to auth service or basic query
    const { data, error } = await supabase.auth.getSession();
    if (!error) {
      return {
        connected: true,
        message:
          'Supabase project reachable. Ready to store data! (Run the SQL schema in Supabase dashboard to create tables if not done yet)',
        tablesFound: [],
      };
    }

    return {
      connected: false,
      message: error ? error.message : 'Unable to connect to Supabase endpoint.',
      tablesFound: [],
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Network error connecting to Supabase.',
      tablesFound: [],
    };
  }
}
