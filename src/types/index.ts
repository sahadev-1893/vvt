export type WingStatus = 'active' | 'inactive';

export interface Course {
  id: string;
  name: string;
  duration: string;
  eligibility: string;
  seats?: number;
  description: string;
  streams?: string[];
}

export interface Wing {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline?: string;
  logo?: string;
  coverImage: string;
  description: string;
  aboutText: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  principalName: string;
  principalQualification: string;
  principalMessage: string;
  principalPhoto?: string;
  establishedYear: number;
  affiliation?: string;
  campusArea?: string;
  studentCount?: number;
  facultyCount?: number;
  courses: Course[];
  facilities: string[];
  admissionInfo: string;
  status: WingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Slider {
  id: string;
  image: string;
  heading: string;
  subheading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type NoticeCategory =
  | 'Academic'
  | 'Admission'
  | 'Examination'
  | 'General'
  | 'Recruitment'
  | 'Tender';

export interface Notice {
  id: string;
  title: string;
  noticeDate: string;
  category: NoticeCategory;
  shortDescription: string;
  fullContent: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'doc' | 'image' | 'none';
  attachmentSize?: string;
  isImportant: boolean;
  isNew: boolean;
  wingId: string; // 'all' or wing id
  status: 'published' | 'draft';
  createdBy?: string;
  createdAt: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  venue: string;
  wingId: string; // 'all' or wing id
  description: string;
  fullContent: string;
  registrationUrl?: string;
  status: EventStatus;
  coverImage: string;
  images: string[];
  documents?: { name: string; url: string }[];
  isPublished: boolean;
  createdAt: string;
}

export type GalleryCategory =
  | 'All'
  | 'VVDC'
  | 'VVHSS'
  | 'Trust'
  | 'Events'
  | 'Campus'
  | 'Students'
  | 'Achievements'
  | 'Functions'
  | 'Other';

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  wingId?: string;
  category: GalleryCategory;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  wingId: string;
  category: GalleryCategory;
  coverPhoto: string;
  description?: string;
  photos: GalleryPhoto[];
  isPublished: boolean;
  createdAt: string;
}

export interface Expert {
  id: string;
  name: string;
  designation: string;
  department: string;
  wingId: string; // 'all' or specific wing id (e.g. 'wing-vvdc', 'wing-vvhss')
  qualification: string;
  experience: string;
  specialization: string;
  bio: string;
  photo: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'new'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected';

export interface CareerApplication {
  id: string;
  applicationId: string; // e.g. VVTI-2026-000001
  fullName: string;
  parentName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  address: string;
  qualification: string;
  experience: string;
  skills: string;
  applyingFor: string;
  preferredWingId: string;
  message?: string;
  cvFileName: string;
  cvFileType: string;
  cvFileData?: string; // Data URL / Base64 for download
  cvFileSize?: string;
  status: ApplicationStatus;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  replyNotes?: string;
  createdAt: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'editor';
export type AdminAccountStatus = 'active' | 'pending_approval' | 'suspended';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: AdminRole;
  status: AdminAccountStatus;
  passwordHash?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  module: string;
  recordTitle: string;
  details?: string;
  timestamp: string;
}

export interface SiteSettings {
  institutionName: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  state: string;
  pin: string;
  country: string;
  phones: string[];
  email: string;
  officeHours: string;
  welcomeHeading: string;
  welcomeSubheading: string;
  welcomeText: string;
  trustHistory: string;
  mission: string;
  vision: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    linkedin: string;
  };
  seo: {
    pageTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
  };
}

// -------------------------------------------------------------
// STUDENT RESULT PUBLISHING SYSTEM TYPES
// -------------------------------------------------------------

export type ExaminationType = 'Annual' | 'Half-Yearly' | 'Semester' | 'Supplementary';
export type PublicationStatus = 'published' | 'draft' | 'unpublished';
export type ResultStatus = 'PASS' | 'FAIL' | 'COMPARTMENT' | 'WITHHELD' | 'PROMOTED';

export interface StudentRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  registrationNumber: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  className: string;
  section: string;
  academicYear: string;
  photoUrl?: string;
  createdAt: string;
}

export interface ExaminationRecord {
  id: string;
  examinationName: string;
  examinationType: ExaminationType;
  academicYear: string;
  classes: string[];
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  heldIn?: string; // e.g. "February - March 2026"
  createdAt: string;
}

export interface SubjectDefinition {
  id: string;
  subjectCode: string;
  subjectName: string;
  fullMarks: number;
  passMarks: number;
  theoryMarks?: number;
  practicalMarks?: number;
  className: string;
  isActive: boolean;
}

export interface SubjectMarkRecord {
  subjectCode: string;
  subjectName: string;
  fullMarks: number;
  passMarks: number;
  marksObtained: number;
  practicalMarksObtained?: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent';
  remarks?: string;
}

export interface StudentResultRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  registrationNumber: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender?: string;
  className: string;
  section: string;
  academicYear: string;
  examinationId: string;
  examinationName: string;
  examinationType: ExaminationType;
  subjects: SubjectMarkRecord[];
  totalFullMarks: number;
  totalMarksObtained: number;
  percentage: number;
  grade: string;
  resultStatus: ResultStatus;
  division?: string;
  remarks: string;
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  verificationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResultAuditRecord {
  id: string;
  adminId: string;
  adminName: string;
  action: 'CREATE_RESULT' | 'UPDATE_MARKS' | 'PUBLISH_RESULT' | 'UNPUBLISH_RESULT' | 'BULK_UPLOAD' | 'DELETE_RESULT';
  recordType: 'StudentResult' | 'Examination' | 'Student';
  recordId: string;
  details: string;
  timestamp: string;
}

export interface ExaminationNotice {
  id: string;
  title: string;
  date: string;
  category: 'Result' | 'Schedule' | 'Re-evaluation' | 'Admit Card' | 'General';
  description: string;
  isImportant?: boolean;
}

export interface ResultSearchLog {
  id: string;
  timestamp: string;
  rollNumber: string;
  examinationType?: string;
  academicYear?: string;
  className?: string;
  success: boolean;
  statusReason?: 'NOT_FOUND' | 'UNPUBLISHED' | 'EXAM_MISMATCH' | 'SUCCESS';
  studentName?: string;
}

export interface DailySearchMetric {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g., 'Mon 04/06'
  totalSearches: number;
  successfulSearches: number;
  notFoundSearches: number;
  unpublishedSearches: number;
}

export interface PublicationTrendMetric {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  publishedCount: number;
  cumulativePublished: number;
  examName?: string;
}

