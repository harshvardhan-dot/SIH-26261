import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function createCompliantApprovalLetter(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();

  // Outer Border
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderWidth: 2,
    borderColor: rgb(0.06, 0.16, 0.26),
  });

  // Header Tricolor Accent Bar
  page.drawRectangle({ x: 30, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(1, 0.6, 0.2) });
  page.drawRectangle({ x: 30 + (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.05, 0.1, 0.5) });
  page.drawRectangle({ x: 30 + 2 * (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.07, 0.53, 0.03) });

  let y = height - 70;

  // Header
  page.drawText('ALL INDIA COUNCIL FOR TECHNICAL EDUCATION', { x: 130, y, size: 14, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 16;
  page.drawText('(A Statutory Body of the Government of India)', { x: 180, y, size: 9.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
  y -= 14;
  page.drawText('Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 • Website: www.aicte-india.org', { x: 95, y, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

  y -= 20;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1.5, color: rgb(0.06, 0.16, 0.26) });

  y -= 25;
  page.drawText('APPROVAL ORDER: EXTENSION OF APPROVAL (EoA) 2025-26', { x: 135, y, size: 11, font: fontBold, color: rgb(0.1, 0.3, 0.6) });

  y -= 25;
  page.drawText('F.No. Northern/1-102938475/2025/EOA', { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Date of Issuance: 30-Apr-2025', { x: width - 210, y, size: 9.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

  y -= 25;
  page.drawText('To,', { x: 50, y, size: 9, font: fontBold });
  y -= 14;
  page.drawText('The Principal / Director,', { x: 50, y, size: 9, font: fontRegular });
  y -= 14;
  page.drawText('APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT,', { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 14;
  page.drawText('Plot No. 402/1, Knowledge Park III, Greater Noida, Uttar Pradesh - 201310', { x: 50, y, size: 8.5, font: fontRegular });

  y -= 25;
  page.drawText('Sub: Extension of Approval for the Academic Year 2025-26.', { x: 50, y, size: 9, font: fontBold });
  y -= 14;
  page.drawText('Ref: Application of the Institution for Extension of Approval for Academic Year 2025-26 (PID: 1-102938475).', { x: 50, y, size: 8.5, font: fontRegular });

  y -= 22;
  const bodyText = [
    'Sir / Madam,',
    'In terms of the provisions under the All India Council for Technical Education (Grant of Approvals for Technical',
    'Institutions) Regulations, 2020 notified on 4th February 2020 and amended from time to time, I am directed to',
    'convey the approval to APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT for courses and intake listed below:'
  ];
  for (const line of bodyText) {
    page.drawText(line, { x: 50, y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.15) });
    y -= 13;
  }

  y -= 15;
  // Approved Courses Table
  page.drawRectangle({ x: 50, y: y - 100, width: width - 100, height: 115, color: rgb(0.98, 0.99, 1), borderWidth: 1, borderColor: rgb(0.7, 0.8, 0.9) });
  
  // Table Header
  page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 20, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('Program', { x: 60, y: y + 1, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Course Level', { x: 120, y: y + 1, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Approved Course Title', { x: 190, y: y + 1, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Affiliating Body', { x: 370, y: y + 1, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Approved Intake', { x: 470, y: y + 1, size: 8, font: fontBold, color: rgb(1, 1, 1) });

  y -= 22;
  const courses = [
    { p: 'Engineering', l: 'Under Graduate', c: 'Computer Science & Engineering', a: 'AKTU, Lucknow', i: '180' },
    { p: 'Engineering', l: 'Under Graduate', c: 'Electronics & Communication', a: 'AKTU, Lucknow', i: '120' },
    { p: 'Engineering', l: 'Under Graduate', c: 'Information Technology', a: 'AKTU, Lucknow', i: '120' },
    { p: 'Engineering', l: 'Under Graduate', c: 'Mechanical Engineering', a: 'AKTU, Lucknow', i: '60' },
  ];

  for (const c of courses) {
    page.drawText(c.p, { x: 60, y, size: 7.5, font: fontRegular });
    page.drawText(c.l, { x: 120, y, size: 7.5, font: fontRegular });
    page.drawText(c.c, { x: 190, y, size: 7.5, font: fontBold });
    page.drawText(c.a, { x: 370, y, size: 7.5, font: fontRegular });
    page.drawText(c.i, { x: 495, y, size: 8, font: fontBold, color: rgb(0.05, 0.35, 0.15) });
    y -= 18;
  }

  y -= 25;
  page.drawText('CRITICAL STATUTORY MANDATES:', { x: 50, y, size: 8.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  y -= 14;
  const mandates = [
    '1. The institution shall maintain continuous affiliation with Dr. APJ Abdul Kalam Technical University (AKTU).',
    '2. Land ownership / continuous lease of 7.85 acres shall remain encumbrance-free under registered sub-registrar deed.',
    '3. Faculty cadre ratio of 1:20 shall be strictly adhered to with PAN-verified monthly bank salary disbursements.',
    '4. Fire Safety NOC and Structural Soundness shall remain valid throughout the 2025-26 academic calendar.'
  ];
  for (const m of mandates) {
    page.drawText(m, { x: 50, y, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    y -= 13;
  }

  y -= 50;
  // Official Digital Signature Block
  page.drawRectangle({ x: width - 240, y: y - 45, width: 190, height: 60, borderWidth: 1, borderColor: rgb(0.1, 0.4, 0.8), color: rgb(0.96, 0.98, 1) });
  page.drawText('PROF. RAJEEV KUMAR', { x: width - 230, y: y + 2, size: 8.5, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('Member Secretary, AICTE', { x: width - 230, y: y - 10, size: 7.5, font: fontRegular });
  page.drawText('Digitally Signed: 30-Apr-2025 16:42 IST', { x: width - 230, y: y - 22, size: 7, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  page.drawText('Verified by National Informatics Centre (NIC)', { x: width - 230, y: y - 34, size: 6.8, font: fontBold, color: rgb(0.05, 0.5, 0.15) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'AICTE_EoA_Approval_Letter_2025_26.pdf'), pdfBytes);
}

async function createMismatchApprovalLetter(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Outer Border with reddish alert tone
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderWidth: 2,
    borderColor: rgb(0.7, 0.15, 0.15),
  });

  // Header Tricolor Accent Bar
  page.drawRectangle({ x: 30, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(1, 0.6, 0.2) });
  page.drawRectangle({ x: 30 + (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.05, 0.1, 0.5) });
  page.drawRectangle({ x: 30 + 2 * (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.07, 0.53, 0.03) });

  let y = height - 70;

  // Header
  page.drawText('ALL INDIA COUNCIL FOR TECHNICAL EDUCATION', { x: 130, y, size: 14, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 16;
  page.drawText('(A Statutory Body of the Government of India)', { x: 180, y, size: 9.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
  y -= 14;
  page.drawText('Nelson Mandela Marg, Vasant Kunj, New Delhi-110070', { x: 170, y, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

  y -= 20;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1.5, color: rgb(0.7, 0.15, 0.15) });

  y -= 25;
  page.drawText('APPROVAL ORDER: EXTENSION OF APPROVAL (EoA) 2023-24 [EXPIRED / MISMATCHED]', { x: 80, y, size: 10, font: fontBold, color: rgb(0.7, 0.1, 0.1) });

  y -= 25;
  // DELIBERATE MISMATCH 1: Reference Number & PID Mismatch
  page.drawText('F.No. Northern/1-994821044/2023/EOA', { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  // DELIBERATE MISMATCH 2: Expired Approval Date (12-May-2023, valid only till 30-Jun-2024)
  page.drawText('Date of Issuance: 12-May-2023 [EXPIRED]', { x: width - 240, y, size: 9.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });

  y -= 25;
  page.drawText('To,', { x: 50, y, size: 9, font: fontBold });
  y -= 14;
  page.drawText('The Principal / Director,', { x: 50, y, size: 9, font: fontRegular });
  y -= 14;
  // DELIBERATE MISMATCH 3: Institution Name Mismatch
  page.drawText('APEX COLLEGE OF ENGINEERING & ADVANCED RESEARCH,', { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  y -= 14;
  page.drawText('Plot No. 402/1, Knowledge Park III, Greater Noida, Uttar Pradesh - 201310', { x: 50, y, size: 8.5, font: fontRegular });

  y -= 25;
  page.drawText('Sub: Extension of Approval for the Academic Year 2023-24.', { x: 50, y, size: 9, font: fontBold });
  y -= 14;
  page.drawText('Ref: Application for EoA Academic Year 2023-24 (PID: 1-994821044).', { x: 50, y, size: 8.5, font: fontRegular });

  y -= 22;
  const bodyText = [
    'NOTICE OF REGULATORY DEFICIENCY & DISCREPANCY SIMULATION:',
    'This document has been deliberately drafted for AICTE compliance auditing demonstrations.',
    '1. Institution Name Discrepancy: "Apex College of Engineering & Advanced Research" vs "Apex Institute of Technology"',
    '2. Lapsed Validity Window: This EoA expired on 30-June-2024. Approval Process Handbook (APH 2024-27 Clause 3.4)',
    '   requires current uninterrupted validity for continuation.',
    '3. Permanent ID Discrepancy: Reference mentions PID 1-994821044 whereas institutional registry records PID 1-102938475.'
  ];
  for (const line of bodyText) {
    page.drawText(line, { x: 50, y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.15) });
    y -= 13;
  }

  y -= 60;
  // Seal
  page.drawRectangle({ x: width - 240, y: y - 45, width: 190, height: 60, borderWidth: 1, borderColor: rgb(0.7, 0.1, 0.1), color: rgb(1, 0.96, 0.96) });
  page.drawText('FLAGGED BY AICTE AUDIT RADAR', { x: width - 230, y: y + 2, size: 8.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  page.drawText('Status: Lapsed / Nomenclature Discrepancy', { x: width - 230, y: y - 10, size: 7.5, font: fontRegular });
  page.drawText('Triggered Rule: APH 2024 Cl. 4.2.1 & 3.4', { x: width - 230, y: y - 22, size: 7, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  page.drawText('Audit Hash: SHA256:e3b0c44298fc1c149afb', { x: width - 230, y: y - 34, size: 6.8, font: fontRegular });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Sample_Approval_Letter_Mismatch.pdf'), pdfBytes);
}

async function main() {
  const docsDir = path.join(process.cwd(), 'public', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  console.log('Generating sample approval letters in:', docsDir);
  await createCompliantApprovalLetter(docsDir);
  console.log('✓ Created AICTE_EoA_Approval_Letter_2025_26.pdf');
  await createMismatchApprovalLetter(docsDir);
  console.log('✓ Created Sample_Approval_Letter_Mismatch.pdf');
  console.log('Approval letters generated successfully!');
}

main().catch(err => {
  console.error('Error generating approval letters:', err);
  process.exit(1);
});
