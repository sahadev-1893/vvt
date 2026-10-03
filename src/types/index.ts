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
