import * as XLSX from 'xlsx';
import {
  StudentRecord,
  ExaminationRecord,
  StudentResultRecord,
  ResultAuditRecord,
  ExaminationNotice,
  SubjectMarkRecord,
  PublicationStatus,
  ResultStatus,
  ResultSearchLog,
  DailySearchMetric,
  PublicationTrendMetric,
} from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'vvt_students_v1',
  EXAMINATIONS: 'vvt_examinations_v1',
  RESULTS: 'vvt_results_v1',
  AUDIT_LOGS: 'vvt_result_audit_v1',
  EXAM_NOTICES: 'vvt_exam_notices_v1',
  SEARCH_LOGS: 'vvt_result_search_logs_v1',
};

function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA
// ---------------------------------------------------------------------------

const defaultExaminations: ExaminationRecord[] = [
  {
    id: 'exam-annual-2026',
    examinationName: 'Higher Secondary & Degree Annual Examination 2026',
    examinationType: 'Annual',
    academicYear: '2025-2026',
    classes: ['Class 12th (Science)', 'Class 12th (Arts)', 'Class 10th (Matric)'],
    publicationStatus: 'published',
    publishedAt: '2026-04-10T10:00:00.000Z',
    heldIn: 'February - March 2026',
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'exam-sem-winter-2025',
    examinationName: 'Undergraduate Semester Examination (Winter 2025)',
    examinationType: 'Semester',
    academicYear: '2025-2026',
    classes: ['B.Sc Computer Science', 'B.Sc Physics Honours', 'B.Com Honours'],
    publicationStatus: 'published',
    publishedAt: '2026-03-25T11:30:00.000Z',
    heldIn: 'December 2025 - January 2026',
    createdAt: '2025-11-20T08:00:00.000Z',
  },
  {
    id: 'exam-halfyearly-2025',
    examinationName: 'Mid-Term / Half-Yearly Examination 2025',
    examinationType: 'Half-Yearly',
    academicYear: '2025-2026',
    classes: ['Class 12th (Science)', 'Class 12th (Commerce)', 'Class 11th (Science)'],
    publicationStatus: 'published',
    publishedAt: '2025-11-15T10:00:00.000Z',
    heldIn: 'October - November 2025',
    createdAt: '2025-09-10T09:00:00.000Z',
  },
  {
    id: 'exam-supple-2025',
    examinationName: 'Special Supplementary / Back-Paper Examination 2025',
    examinationType: 'Supplementary',
    academicYear: '2024-2025',
    classes: ['Class 12th (Science)', 'Class 12th (Commerce)', 'Class 10th (Matric)'],
    publicationStatus: 'published',
    publishedAt: '2025-08-20T14:00:00.000Z',
    heldIn: 'July 2025',
    createdAt: '2025-06-15T10:00:00.000Z',
  },
  {
    id: 'exam-draft-2026',
    examinationName: 'Trial Mock & Internal Assessment 2026',
    examinationType: 'Half-Yearly',
    academicYear: '2025-2026',
    classes: ['Class 12th (Commerce)'],
    publicationStatus: 'draft',
    heldIn: 'April 2026',
    createdAt: '2026-04-01T10:00:00.000Z',
  },
];

const defaultStudents: StudentRecord[] = [
  {
    id: 'std-101',
    studentId: 'VVT/2026/0101',
    studentName: 'Subhasmita Priyadarshini Mohanta',
    rollNumber: '26SCI101',
    registrationNumber: 'CHSE/2024/89401',
    fatherName: 'Rabinarayana Mohanta',
    motherName: 'Kalyani Mohanta',
    dateOfBirth: '2008-04-12',
    gender: 'Female',
    className: 'Class 12th (Science)',
    section: 'A',
    academicYear: '2025-2026',
    createdAt: '2024-07-01T10:00:00.000Z',
  },
  {
    id: 'std-102',
    studentId: 'VVT/2026/0102',
    studentName: 'Aman Kumar Nayak',
    rollNumber: '26SCI102',
    registrationNumber: 'CHSE/2024/89402',
    fatherName: 'Bikram Keshari Nayak',
    motherName: 'Sasmita Nayak',
    dateOfBirth: '2008-08-21',
    gender: 'Male',
    className: 'Class 12th (Science)',
    section: 'A',
    academicYear: '2025-2026',
    createdAt: '2024-07-01T10:00:00.000Z',
  },
  {
    id: 'std-103',
    studentId: 'VVT/2026/0103',
    studentName: 'Priyanka Tripathy',
    rollNumber: '26SCI103',
    registrationNumber: 'CHSE/2024/89403',
    fatherName: 'Debendra Tripathy',
    motherName: 'Geetanjali Tripathy',
    dateOfBirth: '2007-12-05',
    gender: 'Female',
    className: 'Class 12th (Science)',
    section: 'B',
    academicYear: '2025-2026',
    createdAt: '2024-07-01T10:00:00.000Z',
  },
  {
    id: 'std-104',
    studentId: 'VVT/2026/0104',
    studentName: 'Rohan Sharma',
    rollNumber: '26SCI104',
    registrationNumber: 'CHSE/2024/89404',
    fatherName: 'Santosh Sharma',
    motherName: 'Sunita Sharma',
    dateOfBirth: '2008-01-18',
    gender: 'Male',
    className: 'Class 12th (Science)',
    section: 'B',
    academicYear: '2025-2026',
    createdAt: '2024-07-01T10:00:00.000Z',
  },
  {
    id: 'std-201',
    studentId: 'VVT/2026/0201',
    studentName: 'Sneha Barik',
    rollNumber: '26MAT201',
    registrationNumber: 'BSE/2024/55210',
    fatherName: 'Pradeep Kumar Barik',
    motherName: 'Minati Barik',
    dateOfBirth: '2010-05-14',
    gender: 'Female',
    className: 'Class 10th (Matric)',
    section: 'A',
    academicYear: '2025-2026',
    createdAt: '2024-07-05T10:00:00.000Z',
  },
  {
    id: 'std-202',
    studentId: 'VVT/2026/0202',
    studentName: 'Deepak Sahoo',
    rollNumber: '26MAT202',
    registrationNumber: 'BSE/2024/55211',
    fatherName: 'Niranjan Sahoo',
    motherName: 'Sulochana Sahoo',
    dateOfBirth: '2010-09-02',
    gender: 'Male',
    className: 'Class 10th (Matric)',
    section: 'A',
    academicYear: '2025-2026',
    createdAt: '2024-07-05T10:00:00.000Z',
  },
  {
    id: 'std-301',
    studentId: 'VVT/2026/0301',
    studentName: 'Rajesh Kumar Rout',
    rollNumber: '26CS301',
    registrationNumber: 'NCOU/2023/12091',
    fatherName: 'Kishore Chandra Rout',
    motherName: 'Anupama Rout',
    dateOfBirth: '2004-11-20',
    gender: 'Male',
    className: 'B.Sc Computer Science',
    section: 'CS-A',
    academicYear: '2025-2026',
    createdAt: '2023-08-01T10:00:00.000Z',
  },
  {
    id: 'std-401',
    studentId: 'VVT/2026/0401',
    studentName: 'Truptimayee Behera',
    rollNumber: '26COM401',
    registrationNumber: 'CHSE/2024/99101',
    fatherName: 'Ashok Kumar Behera',
    motherName: 'Pratima Behera',
    dateOfBirth: '2008-03-10',
    gender: 'Female',
    className: 'Class 12th (Commerce)',
    section: 'A',
    academicYear: '2025-2026',
    createdAt: '2024-07-01T10:00:00.000Z',
  },
];

// Helper to compute Grade and Result
export function calculateSubjectGrade(marks: number, fullMarks: number = 100): string {
  const percentage = (marks / fullMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}

export function calculateOverallResult(subjects: SubjectMarkRecord[]): {
  totalFullMarks: number;
  totalMarksObtained: number;
  percentage: number;
  grade: string;
  resultStatus: ResultStatus;
  division: string;
  remarks: string;
} {
  const totalFullMarks = subjects.reduce((sum, s) => sum + s.fullMarks, 0);
  const totalMarksObtained = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
  const percentage = totalFullMarks > 0 ? (totalMarksObtained / totalFullMarks) * 100 : 0;

  const failedSubjects = subjects.filter((s) => s.marksObtained < s.passMarks);

  let resultStatus: ResultStatus = 'PASS';
  let division = 'First Division';
  let remarks = 'Outstanding academic performance. Promoted with Distinction.';

  if (failedSubjects.length === 0) {
    resultStatus = 'PASS';
    if (percentage >= 75) {
      division = 'First Division with Distinction';
      remarks = 'Passed with High Distinction.';
    } else if (percentage >= 60) {
      division = 'First Division';
      remarks = 'Passed in First Division.';
    } else if (percentage >= 45) {
      division = 'Second Division';
      remarks = 'Passed in Second Division.';
    } else {
      division = 'Third Division';
      remarks = 'Passed in Third Division.';
    }
  } else if (failedSubjects.length === 1) {
    resultStatus = 'COMPARTMENT';
    division = 'Eligible for Compartment';
    remarks = `Eligible to appear for Compartmental Exam in ${failedSubjects[0].subjectName}.`;
  } else {
    resultStatus = 'FAIL';
    division = 'Failed';
    remarks = `Failed in ${failedSubjects.length} subjects. Needs improvement.`;
  }

  let grade = 'A';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B+';
  else if (percentage >= 60) grade = 'B';
  else if (percentage >= 50) grade = 'C';
  else if (percentage >= 33) grade = 'D';
  else grade = 'F';

  if (resultStatus === 'FAIL') grade = 'F';

  return {
    totalFullMarks,
    totalMarksObtained,
    percentage,
    grade,
    resultStatus,
    division,
    remarks,
  };
}

const defaultResults: StudentResultRecord[] = [
  // 1. Subhasmita - High Scorer (Published Annual 2026)
  {
    id: 'res-101',
    studentId: 'std-101',
    studentName: 'Subhasmita Priyadarshini Mohanta',
    rollNumber: '26SCI101',
    registrationNumber: 'CHSE/2024/89401',
    fatherName: 'Rabinarayana Mohanta',
    motherName: 'Kalyani Mohanta',
    dateOfBirth: '2008-04-12',
    className: 'Class 12th (Science)',
    section: 'A',
    academicYear: '2025-2026',
    examinationId: 'exam-annual-2026',
    examinationName: 'Higher Secondary & Degree Annual Examination 2026',
    examinationType: 'Annual',
    subjects: [
      { subjectCode: 'ENG-12', subjectName: 'Compulsory English', fullMarks: 100, passMarks: 33, marksObtained: 92, grade: 'A+', status: 'Pass' },
      { subjectCode: 'MIL-12', subjectName: 'MIL Odia / Alternative English', fullMarks: 100, passMarks: 33, marksObtained: 89, grade: 'A', status: 'Pass' },
      { subjectCode: 'PHY-12', subjectName: 'Physics (Theory + Practical)', fullMarks: 100, passMarks: 33, marksObtained: 95, grade: 'A+', status: 'Pass' },
      { subjectCode: 'CHE-12', subjectName: 'Chemistry (Theory + Practical)', fullMarks: 100, passMarks: 33, marksObtained: 91, grade: 'A+', status: 'Pass' },
      { subjectCode: 'MTH-12', subjectName: 'Mathematics', fullMarks: 100, passMarks: 33, marksObtained: 98, grade: 'A+', status: 'Pass' },
      { subjectCode: 'BIO-12', subjectName: 'Biology (Botany & Zoology)', fullMarks: 100, passMarks: 33, marksObtained: 90, grade: 'A+', status: 'Pass' },
    ],
    totalFullMarks: 600,
    totalMarksObtained: 555,
    percentage: 92.5,
    grade: 'A+',
    resultStatus: 'PASS',
    division: 'First Division with Distinction',
    remarks: 'State Rank Contender. Conferred Academic Excellence Medal.',
    publicationStatus: 'published',
    publishedAt: '2026-04-10T10:00:00.000Z',
    verificationCode: 'VVT-2026-SCI-994101',
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },

  // 2. Aman Nayak - First Division (Published Annual 2026)
  {
    id: 'res-102',
    studentId: 'std-102',
    studentName: 'Aman Kumar Nayak',
    rollNumber: '26SCI102',
    registrationNumber: 'CHSE/2024/89402',
    fatherName: 'Bikram Keshari Nayak',
    motherName: 'Sasmita Nayak',
    dateOfBirth: '2008-08-21',
    className: 'Class 12th (Science)',
    section: 'A',
    academicYear: '2025-2026',
    examinationId: 'exam-annual-2026',
    examinationName: 'Higher Secondary & Degree Annual Examination 2026',
    examinationType: 'Annual',
    subjects: [
      { subjectCode: 'ENG-12', subjectName: 'Compulsory English', fullMarks: 100, passMarks: 33, marksObtained: 78, grade: 'A', status: 'Pass' },
      { subjectCode: 'MIL-12', subjectName: 'MIL Odia / Alternative English', fullMarks: 100, passMarks: 33, marksObtained: 82, grade: 'A', status: 'Pass' },
      { subjectCode: 'PHY-12', subjectName: 'Physics (Theory + Practical)', fullMarks: 100, passMarks: 33, marksObtained: 76, grade: 'B+', status: 'Pass' },
      { subjectCode: 'CHE-12', subjectName: 'Chemistry (Theory + Practical)', fullMarks: 100, passMarks: 33, marksObtained: 74, grade: 'B+', status: 'Pass' },
      { subjectCode: 'MTH-12', subjectName: 'Mathematics', fullMarks: 100, passMarks: 33, marksObtained: 85, grade: 'A+', status: 'Pass' },
      { subjectCode: 'CSC-12', subjectName: 'Information Technology', fullMarks: 100, passMarks: 33, marksObtained: 88, grade: 'A', status: 'Pass' },
    ],
    totalFullMarks: 600,
    totalMarksObtained: 483,
    percentage: 80.5,
    grade: 'A',
    resultStatus: 'PASS',
    division: 'First Division with Distinction',
    remarks: 'Consistent high performer. Qualified for engineering entrance.',
    publicationStatus: 'published',
    publishedAt: '2026-04-10T10:00:00.000Z',
    verificationCode: 'VVT-2026-SCI-994102',
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },

  // 3. Priyanka Tripathy - Compartment Case (Demonstrates Supplementary handling)
  {
    id: 'res-103',
    studentId: 'std-103',
    studentName: 'Priyanka Tripathy',
    rollNumber: '26SCI103',
    registrationNumber: 'CHSE/2024/89403',
    fatherName: 'Debendra Tripathy',
    motherName: 'Geetanjali Tripathy',
    dateOfBirth: '2007-12-05',
    className: 'Class 12th (Science)',
    section: 'B',
    academicYear: '2025-2026',
    examinationId: 'exam-annual-2026',
    examinationName: 'Higher Secondary & Degree Annual Examination 2026',
    examinationType: 'Annual',
    subjects: [
      { subjectCode: 'ENG-12', subjectName: 'Compulsory English', fullMarks: 100, passMarks: 33, marksObtained: 68, grade: 'B+', status: 'Pass' },
      { subjectCode: 'MIL-12', subjectName: 'MIL Odia / Alternative English', fullMarks: 100, passMarks: 33, marksObtained: 71, grade: 'B+', status: 'Pass' },
      { subjectCode: 'PHY-12', subjectName: 'Physics (Theory + Practical)', fullMarks: 100, passMarks: 33, marksObtained: 62, grade: 'B', status: 'Pass' },
      { subjectCode: 'CHE-12', subjectName: 'Chemistry (Theory + Practical)', fullMarks: 100, passMarks: 33, marksObtained: 28, grade: 'F', status: 'Fail', remarks: 'Short by 5 marks' },
      { subjectCode: 'MTH-12', subjectName: 'Mathematics', fullMarks: 100, passMarks: 33, marksObtained: 65, grade: 'B', status: 'Pass' },
      { subjectCode: 'BIO-12', subjectName: 'Biology (Botany & Zoology)', fullMarks: 100, passMarks: 33, marksObtained: 59, grade: 'C', status: 'Pass' },
    ],
    totalFullMarks: 600,
    totalMarksObtained: 353,
    percentage: 58.83,
    grade: 'C',
    resultStatus: 'COMPARTMENT',
    division: 'Eligible for Compartment',
    remarks: 'Eligible to appear for Compartmental Examination in Chemistry.',
    publicationStatus: 'published',
    publishedAt: '2026-04-10T10:00:00.000Z',
    verificationCode: 'VVT-2026-SCI-994103',
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },

  // 4. Sneha Barik - Class 10th Matric Topper (Published Annual 2026)
  {
    id: 'res-201',
    studentId: 'std-201',
    studentName: 'Sneha Barik',
    rollNumber: '26MAT201',
    registrationNumber: 'BSE/2024/55210',
    fatherName: 'Pradeep Kumar Barik',
    motherName: 'Minati Barik',
    dateOfBirth: '2010-05-14',
    className: 'Class 10th (Matric)',
    section: 'A',
    academicYear: '2025-2026',
    examinationId: 'exam-annual-2026',
    examinationName: 'Higher Secondary & Degree Annual Examination 2026',
    examinationType: 'Annual',
    subjects: [
      { subjectCode: 'FLO-10', subjectName: 'First Language Odia', fullMarks: 100, passMarks: 33, marksObtained: 94, grade: 'A+', status: 'Pass' },
      { subjectCode: 'SLE-10', subjectName: 'Second Language English', fullMarks: 100, passMarks: 33, marksObtained: 88, grade: 'A', status: 'Pass' },
      { subjectCode: 'TLH-10', subjectName: 'Third Language Sanskrit / Hindi', fullMarks: 100, passMarks: 33, marksObtained: 96, grade: 'A+', status: 'Pass' },
      { subjectCode: 'MTH-10', subjectName: 'Mathematics', fullMarks: 100, passMarks: 33, marksObtained: 99, grade: 'A+', status: 'Pass' },
      { subjectCode: 'GSC-10', subjectName: 'General Science', fullMarks: 100, passMarks: 33, marksObtained: 92, grade: 'A+', status: 'Pass' },
      { subjectCode: 'SSC-10', subjectName: 'Social Science (History & Geo)', fullMarks: 100, passMarks: 33, marksObtained: 89, grade: 'A', status: 'Pass' },
    ],
    totalFullMarks: 600,
    totalMarksObtained: 558,
    percentage: 93.0,
    grade: 'A+',
    resultStatus: 'PASS',
    division: 'First Division with Distinction',
    remarks: 'School Topper in BSE Matriculation. Eligible for Merit Scholarship.',
    publicationStatus: 'published',
    publishedAt: '2026-04-10T10:00:00.000Z',
    verificationCode: 'VVT-2026-MAT-552201',
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },

  // 5. Rajesh Kumar Rout - B.Sc Computer Science (Semester Exam Published)
  {
    id: 'res-301',
    studentId: 'std-301',
    studentName: 'Rajesh Kumar Rout',
    rollNumber: '26CS301',
    registrationNumber: 'NCOU/2023/12091',
    fatherName: 'Kishore Chandra Rout',
    motherName: 'Anupama Rout',
    dateOfBirth: '2004-11-20',
    className: 'B.Sc Computer Science',
    section: 'CS-A',
    academicYear: '2025-2026',
    examinationId: 'exam-sem-winter-2025',
    examinationName: 'Undergraduate Semester Examination (Winter 2025)',
    examinationType: 'Semester',
    subjects: [
      { subjectCode: 'CS-401', subjectName: 'Design & Analysis of Algorithms', fullMarks: 100, passMarks: 33, marksObtained: 86, grade: 'A+', status: 'Pass' },
      { subjectCode: 'CS-402', subjectName: 'Database Management Systems', fullMarks: 100, passMarks: 33, marksObtained: 91, grade: 'A+', status: 'Pass' },
      { subjectCode: 'CS-403', subjectName: 'Operating Systems & Linux Kernel', fullMarks: 100, passMarks: 33, marksObtained: 84, grade: 'A', status: 'Pass' },
      { subjectCode: 'CS-404', subjectName: 'Software Engineering Principles', fullMarks: 100, passMarks: 33, marksObtained: 88, grade: 'A', status: 'Pass' },
      { subjectCode: 'CS-405P', subjectName: 'DBMS & Web Technologies Lab', fullMarks: 100, passMarks: 33, marksObtained: 98, grade: 'A+', status: 'Pass' },
    ],
    totalFullMarks: 500,
    totalMarksObtained: 447,
    percentage: 89.4,
    grade: 'A+',
    resultStatus: 'PASS',
    division: 'First Class with Distinction',
    remarks: 'SGPA: 9.24. Outstanding technical proficiency.',
    publicationStatus: 'published',
    publishedAt: '2026-03-25T11:30:00.000Z',
    verificationCode: 'VVT-2026-BSC-883301',
    createdAt: '2026-03-20T08:00:00.000Z',
    updatedAt: '2026-03-25T11:30:00.000Z',
  },

  // 6. Truptimayee Behera - UNPUBLISHED / DRAFT Result (demonstrates unpublish status requirement!)
  {
    id: 'res-401',
    studentId: 'std-401',
    studentName: 'Truptimayee Behera',
    rollNumber: '26COM401',
    registrationNumber: 'CHSE/2024/99101',
    fatherName: 'Ashok Kumar Behera',
    motherName: 'Pratima Behera',
    dateOfBirth: '2008-03-10',
    className: 'Class 12th (Commerce)',
    section: 'A',
    academicYear: '2025-2026',
    examinationId: 'exam-draft-2026',
    examinationName: 'Trial Mock & Internal Assessment 2026',
    examinationType: 'Half-Yearly',
    subjects: [
      { subjectCode: 'ENG-12', subjectName: 'Compulsory English', fullMarks: 100, passMarks: 33, marksObtained: 72, grade: 'A', status: 'Pass' },
      { subjectCode: 'ACT-12', subjectName: 'Accountancy', fullMarks: 100, passMarks: 33, marksObtained: 85, grade: 'A+', status: 'Pass' },
      { subjectCode: 'BST-12', subjectName: 'Business Studies & Management', fullMarks: 100, passMarks: 33, marksObtained: 79, grade: 'A', status: 'Pass' },
      { subjectCode: 'ECO-12', subjectName: 'Business Economics', fullMarks: 100, passMarks: 33, marksObtained: 81, grade: 'A', status: 'Pass' },
      { subjectCode: 'BMT-12', subjectName: 'Business Mathematics & Statistics', fullMarks: 100, passMarks: 33, marksObtained: 76, grade: 'B+', status: 'Pass' },
    ],
    totalFullMarks: 500,
    totalMarksObtained: 393,
    percentage: 78.6,
    grade: 'A',
    resultStatus: 'PASS',
    division: 'First Division',
    remarks: 'Internal evaluation complete. Pending board gazette notification.',
    publicationStatus: 'draft', // Not published yet!
    verificationCode: 'VVT-2026-COM-771401',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
  },
];

const defaultNotices: ExaminationNotice[] = [
  {
    id: 'ntc-res-1',
    title: 'Publication of Annual Examination 2026 Results',
    date: 'April 10, 2026',
    category: 'Result',
    description:
      'Official statement of marks for Class 12th (Science, Arts) and Class 10th (Matric) has been published online. Students can search and download marksheet using their Roll Number.',
    isImportant: true,
  },
  {
    id: 'ntc-res-2',
    title: 'Schedule for Re-evaluation & Answer Script Verification',
    date: 'April 12, 2026',
    category: 'Re-evaluation',
    description:
      'Students intending to apply for re-totaling or photocopy of evaluated answer scripts must submit application through the examination counter before April 25, 2026.',
    isImportant: false,
  },
  {
    id: 'ntc-res-3',
    title: 'Supplementary & Compartmental Examination Registration',
    date: 'April 15, 2026',
    category: 'Schedule',
    description:
      'Candidates placed in the Compartment category may fill out supplementary examination forms online with the prescribed fee starting April 20, 2026.',
    isImportant: true,
  },
  {
    id: 'ntc-res-4',
    title: 'Distribution of Original Hard Copy Marksheet & Pass Certificate',
    date: 'April 18, 2026',
    category: 'General',
    description:
      'Original sealed mark sheets, migration certificates, and character testimonials will be distributed from the respective administrative counters starting May 2, 2026.',
    isImportant: false,
  },
];

const defaultAuditLogs: ResultAuditRecord[] = [
  {
    id: 'aud-1',
    adminId: 'adm-1',
    adminName: 'Mr. Rabinarayana Mohanta (Trust Chairman)',
    action: 'PUBLISH_RESULT',
    recordType: 'Examination',
    recordId: 'exam-annual-2026',
    details: 'Published results for Higher Secondary & Degree Annual Examination 2026.',
    timestamp: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'aud-2',
    adminId: 'adm-1',
    adminName: 'Mr. Rabinarayana Mohanta (Trust Chairman)',
    action: 'BULK_UPLOAD',
    recordType: 'StudentResult',
    recordId: 'bulk-batch-01',
    details: 'Uploaded 150 student result sheets via Excel import with 0 validation errors.',
    timestamp: '2026-04-05T08:15:00.000Z',
  },
];

const defaultSearchLogs: ResultSearchLog[] = [
  // Day -6 (2026-04-05)
  { id: 'sl-1', timestamp: '2026-04-05T09:12:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-2', timestamp: '2026-04-05T10:45:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },
  { id: 'sl-3', timestamp: '2026-04-05T11:20:00.000Z', rollNumber: '26SCI999', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-4', timestamp: '2026-04-05T14:10:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-5', timestamp: '2026-04-05T16:30:00.000Z', rollNumber: '26SCI500', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },

  // Day -5 (2026-04-06)
  { id: 'sl-6', timestamp: '2026-04-06T08:30:00.000Z', rollNumber: '26SCI103', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Subham Patel' },
  { id: 'sl-7', timestamp: '2026-04-06T09:15:00.000Z', rollNumber: '26MAT202', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Deepak Sahoo' },
  { id: 'sl-8', timestamp: '2026-04-06T10:05:00.000Z', rollNumber: '26CS301', examinationType: 'Semester', academicYear: '2025-2026', className: 'B.Sc Computer Science', success: true, statusReason: 'SUCCESS', studentName: 'Rajesh Kumar Rout' },
  { id: 'sl-9', timestamp: '2026-04-06T11:40:00.000Z', rollNumber: '26SCI777', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-10', timestamp: '2026-04-06T13:22:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },
  { id: 'sl-11', timestamp: '2026-04-06T15:50:00.000Z', rollNumber: '26MAT888', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-12', timestamp: '2026-04-06T18:10:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },

  // Day -4 (2026-04-07)
  { id: 'sl-13', timestamp: '2026-04-07T08:00:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },
  { id: 'sl-14', timestamp: '2026-04-07T09:30:00.000Z', rollNumber: '26SCI104', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Rohan Sharma' },
  { id: 'sl-15', timestamp: '2026-04-07T11:00:00.000Z', rollNumber: '26SCI000', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-16', timestamp: '2026-04-07T13:15:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-17', timestamp: '2026-04-07T14:40:00.000Z', rollNumber: '26MAT202', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Deepak Sahoo' },
  { id: 'sl-18', timestamp: '2026-04-07T16:20:00.000Z', rollNumber: '26CS301', examinationType: 'Semester', academicYear: '2025-2026', className: 'B.Sc Computer Science', success: true, statusReason: 'SUCCESS', studentName: 'Rajesh Kumar Rout' },
  { id: 'sl-19', timestamp: '2026-04-07T17:55:00.000Z', rollNumber: '26DRAFT01', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'UNPUBLISHED' },
  { id: 'sl-20', timestamp: '2026-04-07T19:30:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },

  // Day -3 (2026-04-08)
  { id: 'sl-21', timestamp: '2026-04-08T07:45:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-22', timestamp: '2026-04-08T09:10:00.000Z', rollNumber: '26SCI103', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Subham Patel' },
  { id: 'sl-23', timestamp: '2026-04-08T10:20:00.000Z', rollNumber: '26XYZ123', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-24', timestamp: '2026-04-08T11:45:00.000Z', rollNumber: '26SCI104', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Rohan Sharma' },
  { id: 'sl-25', timestamp: '2026-04-08T13:30:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-26', timestamp: '2026-04-08T15:10:00.000Z', rollNumber: '26MAT999', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-27', timestamp: '2026-04-08T16:40:00.000Z', rollNumber: '26CS301', examinationType: 'Semester', academicYear: '2025-2026', className: 'B.Sc Computer Science', success: true, statusReason: 'SUCCESS', studentName: 'Rajesh Kumar Rout' },
  { id: 'sl-28', timestamp: '2026-04-08T18:00:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },
  { id: 'sl-29', timestamp: '2026-04-08T19:25:00.000Z', rollNumber: '26DRAFT02', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Arts)', success: false, statusReason: 'UNPUBLISHED' },
  { id: 'sl-30', timestamp: '2026-04-08T21:10:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },

  // Day -2 (2026-04-09)
  { id: 'sl-31', timestamp: '2026-04-09T08:15:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-32', timestamp: '2026-04-09T09:40:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },
  { id: 'sl-33', timestamp: '2026-04-09T10:50:00.000Z', rollNumber: '26SCI103', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Subham Patel' },
  { id: 'sl-34', timestamp: '2026-04-09T12:00:00.000Z', rollNumber: '26SCI104', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Rohan Sharma' },
  { id: 'sl-35', timestamp: '2026-04-09T13:15:00.000Z', rollNumber: '26SCI888', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-36', timestamp: '2026-04-09T14:30:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-37', timestamp: '2026-04-09T15:45:00.000Z', rollNumber: '26MAT202', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Deepak Sahoo' },
  { id: 'sl-38', timestamp: '2026-04-09T17:00:00.000Z', rollNumber: '26CS301', examinationType: 'Semester', academicYear: '2025-2026', className: 'B.Sc Computer Science', success: true, statusReason: 'SUCCESS', studentName: 'Rajesh Kumar Rout' },
  { id: 'sl-39', timestamp: '2026-04-09T18:20:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },
  { id: 'sl-40', timestamp: '2026-04-09T19:40:00.000Z', rollNumber: '26UNPUB99', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Arts)', success: false, statusReason: 'UNPUBLISHED' },
  { id: 'sl-41', timestamp: '2026-04-09T20:50:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-42', timestamp: '2026-04-09T22:15:00.000Z', rollNumber: '26SCI555', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },

  // Day -1 (2026-04-10 - Publication Day Spike!)
  { id: 'sl-43', timestamp: '2026-04-10T06:10:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-44', timestamp: '2026-04-10T07:25:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },
  { id: 'sl-45', timestamp: '2026-04-10T08:00:00.000Z', rollNumber: '26SCI103', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Subham Patel' },
  { id: 'sl-46', timestamp: '2026-04-10T08:45:00.000Z', rollNumber: '26SCI104', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Rohan Sharma' },
  { id: 'sl-47', timestamp: '2026-04-10T09:30:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-48', timestamp: '2026-04-10T10:15:00.000Z', rollNumber: '26MAT202', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Deepak Sahoo' },
  { id: 'sl-49', timestamp: '2026-04-10T11:00:00.000Z', rollNumber: '26CS301', examinationType: 'Semester', academicYear: '2025-2026', className: 'B.Sc Computer Science', success: true, statusReason: 'SUCCESS', studentName: 'Rajesh Kumar Rout' },
  { id: 'sl-50', timestamp: '2026-04-10T11:45:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },
  { id: 'sl-51', timestamp: '2026-04-10T12:20:00.000Z', rollNumber: '26SCI999', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-52', timestamp: '2026-04-10T13:00:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-53', timestamp: '2026-04-10T13:40:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },
  { id: 'sl-54', timestamp: '2026-04-10T14:15:00.000Z', rollNumber: '26NOTFOUND', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-55', timestamp: '2026-04-10T15:00:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-56', timestamp: '2026-04-10T16:10:00.000Z', rollNumber: '26DRAFT99', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Arts)', success: false, statusReason: 'UNPUBLISHED' },
  { id: 'sl-57', timestamp: '2026-04-10T17:30:00.000Z', rollNumber: '26SCI103', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Subham Patel' },
  { id: 'sl-58', timestamp: '2026-04-10T18:45:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },

  // Day 0 (Today - 2026-04-11)
  { id: 'sl-59', timestamp: '2026-04-11T05:20:00.000Z', rollNumber: '26SCI101', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Aarav Mohanta' },
  { id: 'sl-60', timestamp: '2026-04-11T06:40:00.000Z', rollNumber: '26SCI102', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Priyanka Das' },
  { id: 'sl-61', timestamp: '2026-04-11T07:15:00.000Z', rollNumber: '26SCI104', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: true, statusReason: 'SUCCESS', studentName: 'Rohan Sharma' },
  { id: 'sl-62', timestamp: '2026-04-11T08:00:00.000Z', rollNumber: '26UNKNOWN', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Science)', success: false, statusReason: 'NOT_FOUND' },
  { id: 'sl-63', timestamp: '2026-04-11T08:50:00.000Z', rollNumber: '26MAT201', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 10th (Matric)', success: true, statusReason: 'SUCCESS', studentName: 'Sneha Barik' },
  { id: 'sl-64', timestamp: '2026-04-11T09:30:00.000Z', rollNumber: '26CS301', examinationType: 'Semester', academicYear: '2025-2026', className: 'B.Sc Computer Science', success: true, statusReason: 'SUCCESS', studentName: 'Rajesh Kumar Rout' },
  { id: 'sl-65', timestamp: '2026-04-11T10:15:00.000Z', rollNumber: '26COM401', examinationType: 'Annual', academicYear: '2025-2026', className: 'Class 12th (Commerce)', success: true, statusReason: 'SUCCESS', studentName: 'Truptimayee Behera' },
];

// ---------------------------------------------------------------------------
// SERVICE IMPLEMENTATION
// ---------------------------------------------------------------------------

export const resultService = {
  // Initialize storage if empty
  init() {
    if (!this.getExaminations().length) this.setExaminations(defaultExaminations);
    if (!this.getStudents().length) this.setStudents(defaultStudents);
    if (!this.getResults().length) this.setResults(defaultResults);
    if (!this.getAuditLogs().length) this.setAuditLogs(defaultAuditLogs);
    if (!this.getNotices().length) this.setNotices(defaultNotices);
    if (!this.getSearchLogs().length) this.setSearchLogs(defaultSearchLogs);
  },

  // 1. Examinations CRUD
  getExaminations(): ExaminationRecord[] {
    return getLocalItem<ExaminationRecord[]>(STORAGE_KEYS.EXAMINATIONS, defaultExaminations);
  },
  setExaminations(exams: ExaminationRecord[]) {
    setLocalItem(STORAGE_KEYS.EXAMINATIONS, exams);
  },
  saveExamination(exam: ExaminationRecord, adminName = 'System Admin'): ExaminationRecord {
    const list = this.getExaminations();
    const index = list.findIndex((e) => e.id === exam.id);
    let saved: ExaminationRecord;
    if (index >= 0) {
      saved = { ...exam };
      list[index] = saved;
      this.logAudit('adm-1', adminName, 'UPDATE_MARKS', 'Examination', saved.id, `Updated examination: ${saved.examinationName}`);
    } else {
      saved = {
        ...exam,
        id: exam.id || `exam-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      list.unshift(saved);
      this.logAudit('adm-1', adminName, 'CREATE_RESULT', 'Examination', saved.id, `Created examination: ${saved.examinationName}`);
    }
    this.setExaminations(list);
    return saved;
  },

  // 2. Students CRUD
  getStudents(): StudentRecord[] {
    return getLocalItem<StudentRecord[]>(STORAGE_KEYS.STUDENTS, defaultStudents);
  },
  setStudents(students: StudentRecord[]) {
    setLocalItem(STORAGE_KEYS.STUDENTS, students);
  },
  saveStudent(student: StudentRecord, adminName = 'System Admin'): StudentRecord {
    const list = this.getStudents();
    const index = list.findIndex((s) => s.id === student.id);
    let saved: StudentRecord;

    // Check duplicate roll number in same class & academic year
    const duplicate = list.find(
      (s) =>
        s.id !== student.id &&
        s.rollNumber.trim().toLowerCase() === student.rollNumber.trim().toLowerCase() &&
        s.className.trim().toLowerCase() === student.className.trim().toLowerCase() &&
        s.academicYear.trim().toLowerCase() === student.academicYear.trim().toLowerCase()
    );

    if (duplicate) {
      throw new Error(`Roll Number "${student.rollNumber}" already exists for ${student.className} (${student.academicYear}).`);
    }

    if (index >= 0) {
      saved = { ...student };
      list[index] = saved;
      this.logAudit('adm-1', adminName, 'UPDATE_MARKS', 'Student', saved.id, `Updated student: ${saved.studentName} (${saved.rollNumber})`);
    } else {
      saved = {
        ...student,
        id: student.id || `std-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      list.unshift(saved);
      this.logAudit('adm-1', adminName, 'CREATE_RESULT', 'Student', saved.id, `Added student: ${saved.studentName} (${saved.rollNumber})`);
    }
    this.setStudents(list);
    return saved;
  },
  deleteStudent(id: string, adminName = 'System Admin'): boolean {
    const list = this.getStudents();
    const item = list.find((s) => s.id === id);
    if (!item) return false;
    this.setStudents(list.filter((s) => s.id !== id));
    this.logAudit('adm-1', adminName, 'DELETE_RESULT', 'Student', id, `Deleted student: ${item.studentName}`);
    return true;
  },

  // 3. Results CRUD
  getResults(): StudentResultRecord[] {
    return getLocalItem<StudentResultRecord[]>(STORAGE_KEYS.RESULTS, defaultResults);
  },
  setResults(results: StudentResultRecord[]) {
    setLocalItem(STORAGE_KEYS.RESULTS, results);
  },
  saveResult(res: StudentResultRecord, adminName = 'System Admin'): StudentResultRecord {
    const list = this.getResults();
    const index = list.findIndex((r) => r.id === res.id);
    const calculated = calculateOverallResult(res.subjects);

    let saved: StudentResultRecord;
    if (index >= 0) {
      saved = {
        ...res,
        ...calculated,
        updatedAt: new Date().toISOString(),
      };
      list[index] = saved;
      this.logAudit('adm-1', adminName, 'UPDATE_MARKS', 'StudentResult', saved.id, `Updated marks for ${saved.studentName} (${saved.rollNumber})`);
    } else {
      saved = {
        ...res,
        ...calculated,
        id: res.id || `res-${Date.now()}`,
        verificationCode: res.verificationCode || `VVT-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(saved);
      this.logAudit('adm-1', adminName, 'CREATE_RESULT', 'StudentResult', saved.id, `Created result for ${saved.studentName} (${saved.rollNumber})`);
    }
    this.setResults(list);
    return saved;
  },
  deleteResult(id: string, adminName = 'System Admin'): boolean {
    const list = this.getResults();
    const item = list.find((r) => r.id === id);
    if (!item) return false;
    this.setResults(list.filter((r) => r.id !== id));
    this.logAudit('adm-1', adminName, 'DELETE_RESULT', 'StudentResult', id, `Deleted result for ${item.studentName} (${item.rollNumber})`);
    return true;
  },

  // 4. Public Student Search
  searchResult(params: {
    examinationType?: string;
    examinationId?: string;
    academicYear?: string;
    className?: string;
    rollNumber: string;
    registrationNumber?: string;
  }): {
    success: boolean;
    result?: StudentResultRecord;
    message: string;
    statusReason?: 'NOT_FOUND' | 'UNPUBLISHED' | 'EXAM_MISMATCH';
  } {
    const trimmedRoll = params.rollNumber.trim().toLowerCase();
    const allResults = this.getResults();
    const allExams = this.getExaminations();

    // Helper to log search
    const recordSearch = (
      success: boolean,
      statusReason?: 'NOT_FOUND' | 'UNPUBLISHED' | 'EXAM_MISMATCH' | 'SUCCESS',
      studentName?: string
    ) => {
      this.logSearchResult({
        rollNumber: params.rollNumber.trim(),
        examinationType: params.examinationType,
        academicYear: params.academicYear,
        className: params.className,
        success,
        statusReason,
        studentName,
      });
    };

    // 1. Find matching records by roll number
    const matchingRoll = allResults.filter(
      (r) => r.rollNumber.trim().toLowerCase() === trimmedRoll
    );

    if (matchingRoll.length === 0) {
      recordSearch(false, 'NOT_FOUND');
      return {
        success: false,
        message: 'No result found. Please check your roll number.',
        statusReason: 'NOT_FOUND',
      };
    }

    // 2. Filter by examination / academic year / class if specified
    let candidates = matchingRoll;

    if (params.academicYear && params.academicYear !== 'All') {
      candidates = candidates.filter(
        (r) => r.academicYear.trim().toLowerCase() === params.academicYear!.trim().toLowerCase()
      );
    }

    if (params.examinationType && params.examinationType !== 'All') {
      candidates = candidates.filter(
        (r) => r.examinationType.trim().toLowerCase() === params.examinationType!.trim().toLowerCase()
      );
    }

    if (params.examinationId && params.examinationId !== 'All') {
      candidates = candidates.filter((r) => r.examinationId === params.examinationId);
    }

    if (params.className && params.className !== 'All') {
      candidates = candidates.filter(
        (r) => r.className.trim().toLowerCase() === params.className!.trim().toLowerCase()
      );
    }

    if (candidates.length === 0) {
      recordSearch(false, 'EXAM_MISMATCH');
      return {
        success: false,
        message: 'No result found for the selected examination session. Please verify examination type & academic year.',
        statusReason: 'EXAM_MISMATCH',
      };
    }

    const matchedResult = candidates[0];

    // 3. Check publication status of examination & result
    const parentExam = allExams.find((e) => e.id === matchedResult.examinationId);
    const isExamPublished = parentExam ? parentExam.publicationStatus === 'published' : true;
    const isResultPublished = matchedResult.publicationStatus === 'published';

    if (!isExamPublished || !isResultPublished) {
      recordSearch(false, 'UNPUBLISHED', matchedResult.studentName);
      return {
        success: false,
        message: 'Result has not been published yet. Please check back after official announcement.',
        statusReason: 'UNPUBLISHED',
      };
    }

    recordSearch(true, 'SUCCESS', matchedResult.studentName);
    return {
      success: true,
      result: matchedResult,
      message: 'Result retrieved successfully.',
    };
  },

  // Verification by code
  verifyResult(code: string): StudentResultRecord | null {
    const clean = code.trim().toUpperCase();
    return this.getResults().find((r) => r.verificationCode.toUpperCase() === clean) || null;
  },

  // 5. Publication Controls
  toggleExaminationPublication(
    examId: string,
    status: PublicationStatus,
    adminName = 'System Admin'
  ): boolean {
    const exams = this.getExaminations();
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return false;

    exam.publicationStatus = status;
    if (status === 'published') {
      exam.publishedAt = new Date().toISOString();
    }
    this.setExaminations(exams);

    // Also update publicationStatus for all associated results
    const results = this.getResults();
    results.forEach((r) => {
      if (r.examinationId === examId) {
        r.publicationStatus = status;
        if (status === 'published') {
          r.publishedAt = exam.publishedAt;
        }
      }
    });
    this.setResults(results);

    this.logAudit(
      'adm-1',
      adminName,
      status === 'published' ? 'PUBLISH_RESULT' : 'UNPUBLISH_RESULT',
      'Examination',
      examId,
      `Changed publication status of "${exam.examinationName}" to ${status.toUpperCase()}.`
    );
    return true;
  },

  toggleResultPublication(
    resultId: string,
    status: PublicationStatus,
    adminName = 'System Admin'
  ): boolean {
    const results = this.getResults();
    const res = results.find((r) => r.id === resultId);
    if (!res) return false;

    res.publicationStatus = status;
    if (status === 'published') {
      res.publishedAt = new Date().toISOString();
    }
    this.setResults(results);

    this.logAudit(
      'adm-1',
      adminName,
      status === 'published' ? 'PUBLISH_RESULT' : 'UNPUBLISH_RESULT',
      'StudentResult',
      resultId,
      `Changed publication status of ${res.studentName} (${res.rollNumber}) to ${status.toUpperCase()}.`
    );
    return true;
  },

  // 6. Audit Logging
  getAuditLogs(): ResultAuditRecord[] {
    return getLocalItem<ResultAuditRecord[]>(STORAGE_KEYS.AUDIT_LOGS, defaultAuditLogs).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  setAuditLogs(logs: ResultAuditRecord[]) {
    setLocalItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  },
  logAudit(
    adminId: string,
    adminName: string,
    action: ResultAuditRecord['action'],
    recordType: ResultAuditRecord['recordType'],
    recordId: string,
    details: string
  ) {
    const logs = this.getAuditLogs();
    const newEntry: ResultAuditRecord = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminId,
      adminName,
      action,
      recordType,
      recordId,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    if (logs.length > 200) logs.pop();
    this.setAuditLogs(logs);
  },

  // 7. Search Logs & Daily Search Analytics
  getSearchLogs(): ResultSearchLog[] {
    return getLocalItem<ResultSearchLog[]>(STORAGE_KEYS.SEARCH_LOGS, defaultSearchLogs).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  setSearchLogs(logs: ResultSearchLog[]) {
    setLocalItem(STORAGE_KEYS.SEARCH_LOGS, logs);
  },
  logSearchResult(entry: Omit<ResultSearchLog, 'id' | 'timestamp'>) {
    const logs = this.getSearchLogs();
    const newEntry: ResultSearchLog = {
      ...entry,
      id: `sl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    if (logs.length > 500) logs.pop();
    this.setSearchLogs(logs);
    return newEntry;
  },

  // Compute Daily Search Volume Trend (past N days)
  getDailySearchMetrics(days = 7): DailySearchMetric[] {
    const logs = this.getSearchLogs();
    const result: DailySearchMetric[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

      const dayLogs = logs.filter((l) => l.timestamp.slice(0, 10) === dateStr);
      const total = dayLogs.length;
      const success = dayLogs.filter((l) => l.success).length;
      const notFound = dayLogs.filter((l) => l.statusReason === 'NOT_FOUND' || l.statusReason === 'EXAM_MISMATCH').length;
      const unpublished = dayLogs.filter((l) => l.statusReason === 'UNPUBLISHED').length;

      result.push({
        date: dateStr,
        dayLabel,
        totalSearches: total,
        successfulSearches: success,
        notFoundSearches: notFound,
        unpublishedSearches: unpublished,
      });
    }

    return result;
  },

  // Compute Publication Trends over time
  getPublicationTrends(days = 14): PublicationTrendMetric[] {
    const allResults = this.getResults();
    const published = allResults.filter((r) => r.publicationStatus === 'published');
    const result: PublicationTrendMetric[] = [];
    const now = new Date();

    let runningTotal = 0;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Count results published on or before this day
      const publishedOnDay = published.filter((r) => {
        const pubDate = (r.publishedAt || r.updatedAt || r.createdAt || '').slice(0, 10);
        return pubDate === dateStr;
      }).length;

      runningTotal += publishedOnDay;

      result.push({
        date: dateStr,
        dayLabel,
        publishedCount: publishedOnDay,
        cumulativePublished: runningTotal,
      });
    }

    // Ensure cumulative doesn't undercount if dates were prior to window
    if (result.length > 0 && published.length > 0) {
      const finalCumulative = published.length;
      // Adjust last item to represent current published total
      result[result.length - 1].cumulativePublished = Math.max(result[result.length - 1].cumulativePublished, finalCumulative);
      // smooth backward if needed so cumulative is monotonic
      for (let j = result.length - 2; j >= 0; j--) {
        if (result[j].cumulativePublished > result[j + 1].cumulativePublished) {
          result[j].cumulativePublished = result[j + 1].cumulativePublished;
        }
      }
    }

    return result;
  },

  // 8. Notices
  getNotices(): ExaminationNotice[] {
    return getLocalItem<ExaminationNotice[]>(STORAGE_KEYS.EXAM_NOTICES, defaultNotices);
  },
  setNotices(notices: ExaminationNotice[]) {
    setLocalItem(STORAGE_KEYS.EXAM_NOTICES, notices);
  },

  // 8. Bulk Import / Export via Excel / CSV (using SheetJS)
  generateTemplateWorkbook(): XLSX.WorkBook {
    const templateData = [
      {
        StudentName: 'Deepak Kumar Sahoo',
        RollNumber: '26SCI105',
        RegistrationNumber: 'CHSE/2024/89405',
        FatherName: 'Niranjan Sahoo',
        MotherName: 'Sulochana Sahoo',
        DateOfBirth: '2008-05-15',
        Class: 'Class 12th (Science)',
        Section: 'A',
        AcademicYear: '2025-2026',
        Examination: 'Higher Secondary & Degree Annual Examination 2026',
        Subject: 'Compulsory English',
        SubjectCode: 'ENG-12',
        FullMarks: 100,
        PassMarks: 33,
        MarksObtained: 84,
      },
      {
        StudentName: 'Deepak Kumar Sahoo',
        RollNumber: '26SCI105',
        RegistrationNumber: 'CHSE/2024/89405',
        FatherName: 'Niranjan Sahoo',
        MotherName: 'Sulochana Sahoo',
        DateOfBirth: '2008-05-15',
        Class: 'Class 12th (Science)',
        Section: 'A',
        AcademicYear: '2025-2026',
        Examination: 'Higher Secondary & Degree Annual Examination 2026',
        Subject: 'Physics (Theory + Practical)',
        SubjectCode: 'PHY-12',
        FullMarks: 100,
        PassMarks: 33,
        MarksObtained: 88,
      },
      {
        StudentName: 'Deepak Kumar Sahoo',
        RollNumber: '26SCI105',
        RegistrationNumber: 'CHSE/2024/89405',
        FatherName: 'Niranjan Sahoo',
        MotherName: 'Sulochana Sahoo',
        DateOfBirth: '2008-05-15',
        Class: 'Class 12th (Science)',
        Section: 'A',
        AcademicYear: '2025-2026',
        Examination: 'Higher Secondary & Degree Annual Examination 2026',
        Subject: 'Chemistry (Theory + Practical)',
        SubjectCode: 'CHE-12',
        FullMarks: 100,
        PassMarks: 33,
        MarksObtained: 79,
      },
      {
        StudentName: 'Deepak Kumar Sahoo',
        RollNumber: '26SCI105',
        RegistrationNumber: 'CHSE/2024/89405',
        FatherName: 'Niranjan Sahoo',
        MotherName: 'Sulochana Sahoo',
        DateOfBirth: '2008-05-15',
        Class: 'Class 12th (Science)',
        Section: 'A',
        AcademicYear: '2025-2026',
        Examination: 'Higher Secondary & Degree Annual Examination 2026',
        Subject: 'Mathematics',
        SubjectCode: 'MTH-12',
        FullMarks: 100,
        PassMarks: 33,
        MarksObtained: 92,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results_Template');
    return wb;
  },

  downloadTemplate(format: 'xlsx' | 'csv' = 'xlsx') {
    const wb = this.generateTemplateWorkbook();
    if (format === 'csv') {
      const ws = wb.Sheets[wb.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Student_Results_Upload_Template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      XLSX.writeFile(wb, 'Student_Results_Upload_Template.xlsx');
    }
  },

  parseUploadFile(
    fileData: ArrayBuffer | string
  ): {
    validRecords: StudentResultRecord[];
    errors: { row: number; rollNumber?: string; message: string }[];
    totalRows: number;
  } {
    const wb = XLSX.read(fileData, { type: typeof fileData === 'string' ? 'binary' : 'array' });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<any>(ws);

    const errors: { row: number; rollNumber?: string; message: string }[] = [];
    const groupedByStudent: Record<string, any> = {};

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 2; // Excel row numbering
      const roll = (row.RollNumber || row.rollNumber || row['Roll No'])?.toString().trim();
      const name = (row.StudentName || row.studentName || row.Name)?.toString().trim();
      const subject = (row.Subject || row.subjectName || row.SubjectName)?.toString().trim();
      const subCode = (row.SubjectCode || row.subjectCode || row.Code || subject?.slice(0, 6))?.toString().trim();
      const fullMarks = Number(row.FullMarks || row.fullMarks || 100);
      const passMarks = Number(row.PassMarks || row.passMarks || 33);
      const marksObtained = Number(row.MarksObtained || row.marksObtained || row.Marks);

      if (!roll) {
        errors.push({ row: rowNum, message: 'Missing Roll Number.' });
        return;
      }
      if (!name) {
        errors.push({ row: rowNum, rollNumber: roll, message: 'Missing Student Name.' });
        return;
      }
      if (!subject) {
        errors.push({ row: rowNum, rollNumber: roll, message: 'Missing Subject Name.' });
        return;
      }
      if (isNaN(marksObtained) || marksObtained < 0 || marksObtained > fullMarks) {
        errors.push({
          row: rowNum,
          rollNumber: roll,
          message: `Invalid marks "${marksObtained}" for ${subject}. Must be between 0 and ${fullMarks}.`,
        });
        return;
      }

      const key = `${roll}_${row.AcademicYear || '2025-2026'}_${row.Examination || 'Annual'}`;
      if (!groupedByStudent[key]) {
        groupedByStudent[key] = {
          studentName: name,
          rollNumber: roll,
          registrationNumber: row.RegistrationNumber || row.regNo || `REG-${roll}`,
          fatherName: row.FatherName || "Father's Name",
          motherName: row.MotherName || "Mother's Name",
          dateOfBirth: row.DateOfBirth || '2008-01-01',
          className: row.Class || 'Class 12th',
          section: row.Section || 'A',
          academicYear: row.AcademicYear || '2025-2026',
          examinationName: row.Examination || 'Annual Examination 2026',
          examinationType: (row.ExaminationType || 'Annual') as any,
          examinationId: 'exam-annual-2026',
          subjects: [] as SubjectMarkRecord[],
        };
      }

      groupedByStudent[key].subjects.push({
        subjectCode: subCode || `SUB-${groupedByStudent[key].subjects.length + 1}`,
        subjectName: subject,
        fullMarks,
        passMarks,
        marksObtained,
        grade: calculateSubjectGrade(marksObtained, fullMarks),
        status: marksObtained >= passMarks ? 'Pass' : 'Fail',
      });
    });

    const validRecords: StudentResultRecord[] = [];

    Object.values(groupedByStudent).forEach((group: any) => {
      const calculated = calculateOverallResult(group.subjects);
      const resRecord: StudentResultRecord = {
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentId: `std-${group.rollNumber}`,
        studentName: group.studentName,
        rollNumber: group.rollNumber,
        registrationNumber: group.registrationNumber,
        fatherName: group.fatherName,
        motherName: group.motherName,
        dateOfBirth: group.dateOfBirth,
        className: group.className,
        section: group.section,
        academicYear: group.academicYear,
        examinationId: group.examinationId,
        examinationName: group.examinationName,
        examinationType: group.examinationType,
        subjects: group.subjects,
        ...calculated,
        publicationStatus: 'draft', // Imported as draft by default for admin approval!
        verificationCode: `VVT-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      validRecords.push(resRecord);
    });

    return {
      validRecords,
      errors,
      totalRows: rawRows.length,
    };
  },

  // Commit bulk upload
  commitBulkResults(records: StudentResultRecord[], adminName = 'System Admin'): number {
    const existing = this.getResults();
    let count = 0;
    records.forEach((newRec) => {
      const idx = existing.findIndex(
        (r) =>
          r.rollNumber.trim().toLowerCase() === newRec.rollNumber.trim().toLowerCase() &&
          r.examinationId === newRec.examinationId
      );
      if (idx >= 0) {
        existing[idx] = { ...newRec, id: existing[idx].id };
      } else {
        existing.unshift(newRec);
      }
      count++;
    });

    this.setResults(existing);
    this.logAudit(
      'adm-1',
      adminName,
      'BULK_UPLOAD',
      'StudentResult',
      `bulk-${Date.now()}`,
      `Imported ${count} student result sheets into database.`
    );
    return count;
  },

  // Export Results to Excel Ledger
  exportResultsToExcel(results: StudentResultRecord[], filename = 'Examination_Results_Ledger.xlsx') {
    const flatData = results.map((r, i) => ({
      'Sl No': i + 1,
      'Roll Number': r.rollNumber,
      'Registration No': r.registrationNumber,
      'Student Name': r.studentName,
      "Father's Name": r.fatherName,
      Class: r.className,
      Section: r.section,
      Session: r.academicYear,
      Examination: r.examinationName,
      'Total Full Marks': r.totalFullMarks,
      'Total Marks Obtained': r.totalMarksObtained,
      Percentage: `${r.percentage.toFixed(2)}%`,
      Grade: r.grade,
      Result: r.resultStatus,
      Division: r.division,
      Status: r.publicationStatus.toUpperCase(),
      'Verification Code': r.verificationCode,
    }));

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results_Ledger');
    XLSX.writeFile(wb, filename);
  },
};
