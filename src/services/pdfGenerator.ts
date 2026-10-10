import { jsPDF } from 'jspdf';
import { StudentResultRecord } from '../types';

export interface MarksheetPDFOptions {
  institutionName?: string;
  institutionSubtitle?: string;
  institutionAddress?: string;
  affiliation?: string;
  controllerName?: string;
}

export function generateMarksheetPDF(
  result: StudentResultRecord,
  options?: MarksheetPDFOptions
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  const instName =
    options?.institutionName || 'VISHWA VINAYAK GROUP OF INSTITUTIONS';
  const instSubtitle =
    options?.institutionSubtitle || 'EXAMINATION & ACADEMIC EVALUATION DIRECTORATE';
  const instAddress =
    options?.institutionAddress || 'At/Po - Khireitangiri, Dist - Kendujhar, Odisha - 758046';
  const affiliation =
    options?.affiliation || 'Affiliated to CHSE Odisha & SAMS Higher Education System';
  const controller =
    options?.controllerName || 'Dr. Rabinarayana Mohanta (Controller of Examinations)';

  // Outer decorative border
  doc.setDrawColor(24, 43, 73); // Deep Navy
  doc.setLineWidth(1);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

  // Inner thin border
  doc.setDrawColor(217, 119, 6); // Amber/Gold
  doc.setLineWidth(0.3);
  doc.rect(margin + 1.5, margin + 1.5, contentWidth - 3, pageHeight - margin * 2 - 3);

  // Top Header Banner
  doc.setFillColor(24, 43, 73); // Navy Blue
  doc.rect(margin + 2, margin + 2, contentWidth - 4, 28, 'F');

  // Institution Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(instName, pageWidth / 2, margin + 9, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(251, 191, 36); // Amber
  doc.text(instSubtitle, pageWidth / 2, margin + 14, { align: 'center' });

  doc.setTextColor(226, 232, 240); // Slate light
  doc.setFontSize(7.5);
  doc.text(instAddress, pageWidth / 2, margin + 19, { align: 'center' });
  doc.text(affiliation, pageWidth / 2, margin + 23, { align: 'center' });

  // Marksheet Heading
  const headerY = margin + 35;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + 10, headerY, contentWidth - 20, 10, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('OFFICIAL STATEMENT OF MARKS', pageWidth / 2, headerY + 4.5, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `${result.examinationName.toUpperCase()} • SESSION: ${result.academicYear}`,
    pageWidth / 2,
    headerY + 8.5,
    { align: 'center' }
  );

  // Student Details Box
  const bioY = headerY + 14;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(margin + 5, bioY, contentWidth - 10, 36);

  // Background subtle bar for section
  doc.setFillColor(241, 245, 249);
  doc.rect(margin + 5, bioY, contentWidth - 10, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('STUDENT PROFILE & ENROLLMENT PARTICULARS', margin + 8, bioY + 4.2);

  // Bio fields in 2 columns
  const col1X = margin + 8;
  const col2X = margin + 100;
  let bioLineY = bioY + 11;
  const lineSpacing = 5.8;

  doc.setFontSize(8);

  // Col 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Student Name:', col1X, bioLineY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(result.studentName.toUpperCase(), col1X + 28, bioLineY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Father's Name:", col1X, bioLineY + lineSpacing);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(result.fatherName, col1X + 28, bioLineY + lineSpacing);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Mother's Name:", col1X, bioLineY + lineSpacing * 2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(result.motherName, col1X + 28, bioLineY + lineSpacing * 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Date of Birth:', col1X, bioLineY + lineSpacing * 3);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(result.dateOfBirth || 'N/A', col1X + 28, bioLineY + lineSpacing * 3);

  // Col 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Roll Number:', col2X, bioLineY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Amber bold
  doc.text(result.rollNumber, col2X + 32, bioLineY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Registration No:', col2X, bioLineY + lineSpacing);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(result.registrationNumber, col2X + 32, bioLineY + lineSpacing);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Class / Course:', col2X, bioLineY + lineSpacing * 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.className} (Sec: ${result.section})`, col2X + 32, bioLineY + lineSpacing * 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Verification Code:', col2X, bioLineY + lineSpacing * 3);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138); // Blue
  doc.text(result.verificationCode, col2X + 32, bioLineY + lineSpacing * 3);

  // Marks Table
  const tableY = bioY + 41;
  const colWidths = [18, 68, 22, 22, 26, 18, 16]; // sum = 190 mm = contentWidth
  const headers = ['Code', 'Subject Description', 'Max Marks', 'Pass Marks', 'Marks Obtained', 'Grade', 'Result'];

  // Table Header
  doc.setFillColor(24, 43, 73);
  doc.rect(margin + 5, tableY, contentWidth - 10, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  let currentX = margin + 5;
  headers.forEach((h, i) => {
    const w = colWidths[i];
    const align = i >= 2 ? 'center' : 'left';
    const textX = align === 'center' ? currentX + w / 2 : currentX + 3;
    doc.text(h, textX, tableY + 5.2, { align: align as any });
    currentX += w;
  });

  // Table Rows
  let rowY = tableY + 8;
  const rowHeight = 7.5;
  doc.setFontSize(8);

  result.subjects.forEach((sub, idx) => {
    // Alternating row background
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin + 5, rowY, contentWidth - 10, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin + 5, rowY + rowHeight, margin + contentWidth - 5, rowY + rowHeight);

    currentX = margin + 5;

    // Code
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(sub.subjectCode, currentX + 3, rowY + 5.2);
    currentX += colWidths[0];

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(sub.subjectName, currentX + 3, rowY + 5.2);
    currentX += colWidths[1];

    // Max Marks
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(String(sub.fullMarks), currentX + colWidths[2] / 2, rowY + 5.2, { align: 'center' });
    currentX += colWidths[2];

    // Pass Marks
    doc.text(String(sub.passMarks), currentX + colWidths[3] / 2, rowY + 5.2, { align: 'center' });
    currentX += colWidths[3];

    // Marks Obtained
    doc.setFont('helvetica', 'bold');
    const isPass = sub.marksObtained >= sub.passMarks;
    if (isPass) {
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setTextColor(220, 38, 38); // Red
    }
    doc.text(String(sub.marksObtained), currentX + colWidths[4] / 2, rowY + 5.2, { align: 'center' });
    currentX += colWidths[4];

    // Grade
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(sub.grade, currentX + colWidths[5] / 2, rowY + 5.2, { align: 'center' });
    currentX += colWidths[5];

    // Status
    doc.setFont('helvetica', 'bold');
    if (sub.status === 'Pass') {
      doc.setTextColor(22, 101, 52); // Emerald
      doc.text('PASS', currentX + colWidths[6] / 2, rowY + 5.2, { align: 'center' });
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text('FAIL', currentX + colWidths[6] / 2, rowY + 5.2, { align: 'center' });
    }

    rowY += rowHeight;
  });

  // Table Outer Vertical Grid Lines
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(margin + 5, tableY, contentWidth - 10, rowY - tableY);

  // Total Summary Box
  const summaryY = rowY + 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin + 5, summaryY, contentWidth - 10, 24, 'FD');

  // Total calculation blocks
  const sumCol1 = margin + 12;
  const sumCol2 = margin + 65;
  const sumCol3 = margin + 115;
  const sumCol4 = margin + 155;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('GRAND TOTAL', sumCol1, summaryY + 7);
  doc.text('PERCENTAGE', sumCol2, summaryY + 7);
  doc.text('OVERALL GRADE', sumCol3, summaryY + 7);
  doc.text('FINAL RESULT', sumCol4, summaryY + 7);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'black');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${result.totalMarksObtained} / ${result.totalFullMarks}`,
    sumCol1,
    summaryY + 16
  );

  doc.text(`${result.percentage.toFixed(2)}%`, sumCol2, summaryY + 16);

  doc.setTextColor(30, 58, 138);
  doc.text(result.grade, sumCol3, summaryY + 16);

  // Result Badge
  if (result.resultStatus === 'PASS') {
    doc.setFillColor(22, 101, 52); // Green
    doc.roundedRect(sumCol4 - 2, summaryY + 10, 28, 9, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.text('PASS', sumCol4 + 12, summaryY + 16, { align: 'center' });
  } else if (result.resultStatus === 'COMPARTMENT') {
    doc.setFillColor(202, 138, 4); // Amber
    doc.roundedRect(sumCol4 - 2, summaryY + 10, 34, 9, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('COMPARTMENT', sumCol4 + 15, summaryY + 16, { align: 'center' });
  } else {
    doc.setFillColor(185, 28, 28); // Red
    doc.roundedRect(sumCol4 - 2, summaryY + 10, 28, 9, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.text('FAIL', sumCol4 + 12, summaryY + 16, { align: 'center' });
  }

  // Remarks & Grading Key
  const remarksY = summaryY + 28;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(`Official Remarks: `, margin + 6, remarksY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${result.remarks || 'Eligible for higher studies / promotion.'} | Division: ${
      result.division || 'First Division'
    }`,
    margin + 32,
    remarksY
  );

  // Security Note & Instructions
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const secNote =
    'NOTE: This computer-generated mark sheet is digitally verified by the Controller of Examinations. In case of any discrepancy, original institutional gazette records shall prevail. Verify authentic record at the official portal using Verification Code: ' +
    result.verificationCode;
  doc.text(secNote, margin + 6, remarksY + 5, { maxWidth: contentWidth - 12 });

  // Signature Area
  const sigY = pageHeight - margin - 32;

  // Verifier / Principal seal
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin + 12, sigY + 14, margin + 65, sigY + 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Prepared & Checked By', margin + 38, sigY + 18, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Academic Verification Cell', margin + 38, sigY + 22, { align: 'center' });

  // Center QR Simulation Badge
  const qrX = pageWidth / 2 - 12;
  doc.setDrawColor(30, 58, 138);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(qrX, sigY + 2, 24, 24, 1.5, 1.5, 'FD');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('OFFICIAL QR', qrX + 12, sigY + 7, { align: 'center' });
  doc.text('VERIFICATION', qrX + 12, sigY + 11, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('PORTAL VERIFIED', qrX + 12, sigY + 17, { align: 'center' });
  doc.text(result.verificationCode.slice(0, 10), qrX + 12, sigY + 22, { align: 'center' });

  // Controller of Examinations signature
  doc.line(pageWidth - margin - 65, sigY + 14, pageWidth - margin - 12, sigY + 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(controller, pageWidth - margin - 38, sigY + 18, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Controller of Examinations', pageWidth - margin - 38, sigY + 22, { align: 'center' });

  // Publication Date & Footer
  const footerY = pageHeight - margin - 4;
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  const pubDate = result.publishedAt
    ? new Date(result.publishedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN');
  doc.text(`Date of Issue: ${pubDate}`, margin + 6, footerY);
  doc.text(`ONLINE STUDENT RESULT PORTAL • ISO 9001:2015 CERTIFIED INSTITUTION`, pageWidth / 2, footerY, {
    align: 'center',
  });
  doc.text(`Page 1 of 1`, pageWidth - margin - 6, footerY, { align: 'right' });

  return doc;
}

export function downloadMarksheetPDF(
  result: StudentResultRecord,
  options?: MarksheetPDFOptions
) {
  const doc = generateMarksheetPDF(result, options);
  const sanitizedName = result.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${result.rollNumber}_${sanitizedName}_Marksheet.pdf`;
  doc.save(filename);
}
