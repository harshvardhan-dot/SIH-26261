import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function createFireSafetyNOC(docsDir) {
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

  // Inner Border
  page.drawRectangle({
    x: 29,
    y: 29,
    width: width - 58,
    height: height - 58,
    borderWidth: 0.5,
    borderColor: rgb(0.8, 0.2, 0.2),
  });

  // Header Tricolor Accent Bar
  page.drawRectangle({ x: 30, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(1, 0.6, 0.2) });
  page.drawRectangle({ x: 30 + (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.05, 0.1, 0.5) });
  page.drawRectangle({ x: 30 + 2 * (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.07, 0.53, 0.03) });

  let y = height - 70;

  // Header
  page.drawText('GOVERNMENT OF UTTAR PRADESH', { x: 180, y, size: 13, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 18;
  page.drawText('DIRECTORATE OF FIRE & EMERGENCY SERVICES', { x: 140, y, size: 15, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  y -= 15;
  page.drawText('OFFICE OF THE CHIEF FIRE OFFICER, DISTRICT GAUTAM BUDDHA NAGAR', { x: 105, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  y -= 25;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 25;
  page.drawText('Dispatch No: UP/FS/GBN/2025/NOC-49210', { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Date of Issue: 28-Nov-2025', { x: width - 200, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

  y -= 30;
  // Title Box
  page.drawRectangle({ x: 100, y: y - 8, width: width - 200, height: 28, color: rgb(0.96, 0.97, 0.98), borderWidth: 1, borderColor: rgb(0.8, 0.8, 0.8) });
  page.drawText('STATUTORY FIRE SAFETY NO OBJECTION CERTIFICATE (NOC)', { x: 120, y: y + 2, size: 11, font: fontBold, color: rgb(0.06, 0.16, 0.26) });

  y -= 40;
  page.drawText('TO WHOMSOEVER IT MAY CONCERN', { x: 210, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

  y -= 25;
  const lines = [
    '1. This is to certify that the educational institutional premises of:',
    '   APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT',
    '   Plot No. 402/1, Knowledge Park III, Greater Noida, District Gautam Buddha Nagar (U.P.)',
    '   AICTE Permanent ID: 1-102938475',
    '',
    '2. The multi-storey academic, administrative, and laboratory blocks comprising Ground + 4 floors',
    '   were inspected by the Divisional Fire Officer on 22-Nov-2025 as per the provisions of the',
    '   National Building Code (NBC 2016 Part 4 - Fire & Life Safety) and UP Fire Prevention Act.',
    '',
    '3. Fire Fighting Equipment & Infrastructure Verified On-Site:',
    '   • Wet Riser & Down-comer system: Operational with 2500 LPM electric main pump & diesel standby.',
    '   • Yard Hydrants & First Aid Hose Reels: Installed across all instructional floors.',
    '   • Underground Static Water Tank: 1,50,000 Litres capacity dedicated solely to fire safety.',
    '   • Overhead Tank: 25,000 Litres capacity at terrace level.',
    '   • Fire Extinguishers (ABC & CO2): 140 units installed and serviced.',
    '   • Fire Alarm & Public Address System: Fully operational in all blocks.',
    '',
    '4. CONDITIONS OF VALIDITY:',
    '   This No Objection Certificate is valid for ONE YEAR from date of issue, expiring on 15-Nov-2026.',
    '   The institutional management must apply for annual renewal at least 30 days prior to expiry.',
    '   All fire exit passages and emergency staircases must remain clear of any obstructions at all times.',
  ];

  for (const line of lines) {
    if (line.startsWith('   APEX')) {
      page.drawText(line, { x: 50, y, size: 10, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
    } else if (line.startsWith('   This No Objection')) {
      page.drawText(line, { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
    } else {
      page.drawText(line, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    }
    y -= 16;
  }

  y -= 30;

  // Stamp and Signature
  page.drawRectangle({ x: width - 240, y: y - 60, width: 190, height: 75, borderWidth: 1, borderColor: rgb(0.2, 0.4, 0.7), color: rgb(0.97, 0.98, 1) });
  page.drawText('DIGITALLY SIGNED & SEALED', { x: width - 225, y: y + 2, size: 8, font: fontBold, color: rgb(0.1, 0.4, 0.8) });
  page.drawText('CHIEF FIRE OFFICER', { x: width - 225, y: y - 12, size: 9, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('Fire Services Division, Gautam Buddha Nagar', { x: width - 225, y: y - 24, size: 7.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Digital Token: 2025:UPFS:DSC:89421A', { x: width - 225, y: y - 36, size: 7, font: fontOblique, color: rgb(0.4, 0.4, 0.4) });
  page.drawText('Date: 28-Nov-2025 15:42:10 IST', { x: width - 225, y: y - 48, size: 7, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

  // QR Code Box Placeholder
  page.drawRectangle({ x: 50, y: y - 60, width: 75, height: 75, borderWidth: 1, borderColor: rgb(0.5, 0.5, 0.5), color: rgb(0.95, 0.95, 0.95) });
  page.drawText('[ OFFICIAL QR ]', { x: 56, y: y - 20, size: 7.5, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Scan to verify on', { x: 55, y: y - 34, size: 6.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText('upfireservice.gov.in', { x: 53, y: y - 44, size: 6, font: fontBold, color: rgb(0.1, 0.3, 0.6) });

  // Footer
  page.drawText('Page 1 of 1 • Official Statutory Document under Section 65B of Indian Evidence Act', { x: 120, y: 35, size: 7.5, font: fontOblique, color: rgb(0.5, 0.5, 0.5) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Fire_Safety_NOC_StateDirectorate.pdf'), pdfBytes);
}

async function createFacultyCadreRoster(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const { width, height } = page.getSize();

  // Border
  page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderWidth: 1.5, borderColor: rgb(0.1, 0.2, 0.4) });

  let y = height - 60;
  page.drawText('APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT', { x: 130, y, size: 14, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 16;
  page.drawText('Approved by AICTE (PID: 1-102938475) • Affiliated to AKTU Lucknow', { x: 140, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  y -= 14;
  page.drawText('Knowledge Park III, Greater Noida, Uttar Pradesh - 201306', { x: 175, y, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });

  y -= 20;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.2, 0.2, 0.2) });

  y -= 25;
  page.drawText('ANNUAL FACULTY CADRE & SALARY AUDIT STATEMENT (AY 2026-27)', { x: 90, y, size: 11, font: fontBold, color: rgb(0.1, 0.3, 0.6) });
  y -= 14;
  page.drawText('As per AICTE Approval Process Handbook (APH 2024-27) Appendix 7', { x: 145, y, size: 8.5, font: fontOblique, color: rgb(0.4, 0.4, 0.4) });

  y -= 30;
  // Summary Table Header
  page.drawRectangle({ x: 45, y: y - 5, width: width - 90, height: 22, color: rgb(0.9, 0.94, 0.98), borderWidth: 1, borderColor: rgb(0.7, 0.8, 0.9) });
  page.drawText('Department', { x: 55, y: y + 2, size: 8.5, font: fontBold });
  page.drawText('Sanctioned Intake', { x: 180, y: y + 2, size: 8.5, font: fontBold });
  page.drawText('Required Faculty (1:20)', { x: 280, y: y + 2, size: 8.5, font: fontBold });
  page.drawText('Prof / Assoc / Asst', { x: 400, y: y + 2, size: 8.5, font: fontBold });
  page.drawText('Status', { x: 500, y: y + 2, size: 8.5, font: fontBold });

  y -= 24;

  const tableData = [
    { dept: 'Computer Science & Engg (CSE)', intake: '240 Seats', req: '12 Faculty', cadre: '1 / 3 / 8', status: 'SHORTFALL (Prof -1)', flag: true },
    { dept: 'Information Technology (IT)', intake: '120 Seats', req: '6 Faculty', cadre: '1 / 2 / 3', status: 'Compliant', flag: false },
    { dept: 'Electronics & Comm (ECE)', intake: '120 Seats', req: '6 Faculty', cadre: '1 / 2 / 3', status: 'Compliant', flag: false },
    { dept: 'Mechanical Engineering (ME)', intake: '120 Seats', req: '6 Faculty', cadre: '1 / 2 / 3', status: 'Compliant', flag: false },
    { dept: 'Applied Sciences & Hum.', intake: '1st Year', req: '8 Faculty', cadre: '1 / 2 / 5', status: 'Compliant', flag: false },
  ];

  for (const row of tableData) {
    page.drawRectangle({ x: 45, y: y - 4, width: width - 90, height: 20, color: row.flag ? rgb(1, 0.96, 0.96) : rgb(1, 1, 1), borderWidth: 0.5, borderColor: rgb(0.85, 0.85, 0.85) });
    page.drawText(row.dept, { x: 55, y: y + 2, size: 8, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(row.intake, { x: 180, y: y + 2, size: 8, font: fontRegular });
    page.drawText(row.req, { x: 280, y: y + 2, size: 8, font: fontRegular });
    page.drawText(row.cadre, { x: 400, y: y + 2, size: 8, font: fontRegular });
    page.drawText(row.status, { x: 500, y: y + 2, size: 8, font: fontBold, color: row.flag ? rgb(0.8, 0.1, 0.1) : rgb(0.1, 0.6, 0.2) });
    y -= 20;
  }

  y -= 20;
  page.drawText('AUDIT NOTE & OBSERVATION ON CADRE PROPORTION:', { x: 45, y, size: 9, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
  y -= 14;
  page.drawText('Under APH Appendix 7 Table 7.1, the Cadre ratio requirement for B.Tech CSE (Intake 240) requires:', { x: 45, y, size: 8, font: fontRegular });
  y -= 12;
  page.drawText('Minimum 2 Professors. Currently 1 Professor (Dr. V. K. Saxena) is present on regular payroll.', { x: 45, y, size: 8, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
  y -= 12;
  page.drawText('Deficiency: Shortfall of 1 Professor. Selection Committee interview is scheduled for 10-Nov-2026.', { x: 45, y, size: 8, font: fontRegular, color: rgb(0.7, 0.1, 0.1) });

  y -= 25;
  page.drawText('SALARY DISBURSEMENT & INCOME TAX AUDIT VERIFICATION:', { x: 45, y, size: 9, font: fontBold, color: rgb(0.1, 0.3, 0.6) });
  y -= 14;
  page.drawText('All 38 full-time regular faculty members are paid through bank electronic ECS transfer (7th CPC scale).', { x: 45, y, size: 8, font: fontRegular });
  y -= 12;
  page.drawText('Aadhaar IDs cross-verified with DigiLocker. Form 16 TDS certificates audited for Assessment Year 2025-26.', { x: 45, y, size: 8, font: fontRegular });

  y -= 50;
  // Signatures
  page.drawText('Sd/-', { x: 80, y, size: 9, font: fontRegular });
  page.drawText('Sd/-', { x: width - 200, y, size: 9, font: fontRegular });
  y -= 14;
  page.drawText('DR. SANJAY MEHTA', { x: 80, y, size: 9, font: fontBold });
  page.drawText('CA S. K. SINGHAL, FCA', { x: width - 200, y, size: 9, font: fontBold });
  y -= 12;
  page.drawText('Principal / Director', { x: 80, y, size: 8, font: fontRegular });
  page.drawText('Statutory Auditor (M.No 084920)', { x: width - 200, y, size: 8, font: fontRegular });
  y -= 12;
  page.drawText('Apex Institute of Technology', { x: 80, y, size: 8, font: fontRegular });
  page.drawText('ICAI UDIN: 25084920BKAL8941', { x: width - 200, y, size: 8, font: fontBold, color: rgb(0.1, 0.4, 0.7) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Faculty_Aadhaar_Form16_AuditedList.pdf'), pdfBytes);
}

async function createLandTitleDeed(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderWidth: 2, borderColor: rgb(0.2, 0.3, 0.4) });

  let y = height - 60;
  page.drawText('GOVERNMENT OF UTTAR PRADESH', { x: 190, y, size: 12, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 16;
  page.drawText('REGISTRATION AND STAMPS DEPARTMENT', { x: 160, y, size: 13, font: fontBold, color: rgb(0.1, 0.3, 0.6) });
  y -= 14;
  page.drawText('OFFICE OF SUB-REGISTRAR, GREATER NOIDA, DISTRICT GAUTAM BUDDHA NAGAR', { x: 90, y, size: 8.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  y -= 25;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 25;
  page.drawText('Deed Registration No: GN/2018/DEED/402198', { x: 50, y, size: 10, font: fontBold });
  page.drawText('Date of Registration: 14-Aug-2018', { x: width - 210, y, size: 10, font: fontBold });

  y -= 30;
  page.drawText('CERTIFIED COPY OF REGISTERED PERPETUAL LEASE DEED', { x: 120, y, size: 11, font: fontBold, color: rgb(0.06, 0.16, 0.26) });

  y -= 30;
  const lines = [
    'THIS INDENTURE OF LEASE DEED executed on this 14th day of August 2018 between:',
    '',
    'LESSOR: GREATER NOIDA INDUSTRIAL DEVELOPMENT AUTHORITY (GNIDA)',
    'A statutory authority constituted under Section 3 of the UP Industrial Area Development Act, 1976.',
    '',
    'LESSEE: APEX EDUCATIONAL TRUST',
    'A registered charitable educational trust having its registered office at Greater Noida.',
    '',
    'SCHEDULE OF PROPERTY DEMARCATED FOR INSTITUTIONAL USE:',
    '• Plot Designation: Plot No. 402/1, Sector Knowledge Park III, Greater Noida.',
    '• Total Land Area: 31,767.80 Sq. Meters (Equivalent to 7.85 Acres Continuous Unbroken Land).',
    '• Permissible Land Use: Educational Institutional (Degree Technical Institute - AICTE Approved).',
    '• Lease Term: 90 Years Perpetual Lease with Full Title and Possession.',
    '• Revenue Khasra Details: Khasra Nos. 104, 105/1, 106 situated in Village Tugalpur, Tehsil Dadri.',
    '',
    'ENCUMBRANCE & CONTIGUITY DECLARATION:',
    'The Sub-Registrar hereby certifies that the subject property is 100% continuous, non-encumbered,',
    'free from litigation, and demarcated with permanent concrete boundary walls on all four coordinates:',
    '  North: 45-Meter Master Plan Road (Frontage 210 Meters)',
    '  South: Institutional Green Belt Buffer',
    '  East: 24-Meter Zonal Sector Road',
    '  West: Institutional Plot 402/2',
    '',
    'STATUS OF AICTE COMPLIANCE:',
    'Meets AICTE Approval Process Handbook (APH) norm of minimum 5.0 acres for Mega/Metro Cities.',
  ];

  for (const line of lines) {
    if (line.startsWith('THIS') || line.startsWith('SCHEDULE') || line.startsWith('ENCUMBRANCE') || line.startsWith('STATUS')) {
      page.drawText(line, { x: 50, y, size: 8.5, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
    } else {
      page.drawText(line, { x: 50, y, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    }
    y -= 14;
  }

  y -= 30;
  // Official Stamp
  page.drawRectangle({ x: width - 230, y: y - 50, width: 180, height: 65, borderWidth: 1, borderColor: rgb(0.2, 0.4, 0.7), color: rgb(0.96, 0.98, 1) });
  page.drawText('SUB-REGISTRAR, GREATER NOIDA', { x: width - 220, y: y + 2, size: 8.5, font: fontBold, color: rgb(0.1, 0.3, 0.6) });
  page.drawText('Registration Stamp & Fee Paid: Rs 14,50,000', { x: width - 220, y: y - 12, size: 7.5, font: fontRegular });
  page.drawText('DigiLocker Linked: UP-DL-REV-891024', { x: width - 220, y: y - 24, size: 7.5, font: fontBold, color: rgb(0.1, 0.5, 0.2) });
  page.drawText('Verified via State Bhulekh Gateway', { x: width - 220, y: y - 36, size: 7, font: fontRegular });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Land_Title_Khasra_Deed_Registered.pdf'), pdfBytes);
}

async function createAKTUContinuanceLetter(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderWidth: 1.5, borderColor: rgb(0.1, 0.3, 0.5) });

  let y = height - 60;
  page.drawText('DR. A.P.J. ABDUL KALAM TECHNICAL UNIVERSITY', { x: 125, y, size: 13, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 15;
  page.drawText('UTTAR PRADESH, SECTOR-11, JANKIPURAM VISTAR, LUCKNOW - 226031', { x: 120, y, size: 8.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  y -= 25;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 25;
  page.drawText('Ref: AKTU/Affil/2026-27/RO-N/8941', { x: 50, y, size: 10, font: fontBold });
  page.drawText('Date: 04-Oct-2026', { x: width - 180, y, size: 10, font: fontBold });

  y -= 30;
  page.drawText('OFFICIAL LETTER OF AFFILIATION EXTENSION (AY 2026-27)', { x: 130, y, size: 11, font: fontBold, color: rgb(0.1, 0.3, 0.6) });

  y -= 30;
  page.drawText('To,', { x: 50, y, size: 9, font: fontRegular });
  y -= 12;
  page.drawText('The Director / Principal,', { x: 50, y, size: 9, font: fontBold });
  y -= 12;
  page.drawText('Apex Institute of Technology & Management (College Code: 092)', { x: 50, y, size: 9, font: fontBold });
  y -= 12;
  page.drawText('Knowledge Park III, Greater Noida (U.P.)', { x: 50, y, size: 9, font: fontRegular });

  y -= 25;
  page.drawText('Subject: Continuation of Provisional Affiliation for Academic Session 2026-27.', { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.06, 0.16, 0.26) });

  y -= 20;
  const lines = [
    'Sir/Madam,',
    '',
    'With reference to your online application and subsequent scrutiny by the University Affiliation Committee,',
    'I am directed to convey the continuation of provisional affiliation for the following courses with intake:',
    '',
    '  Program: B.Tech in Computer Science & Engineering (Sanctioned Intake: 240)',
    '  Program: B.Tech in Information Technology (Sanctioned Intake: 120)',
    '  Program: B.Tech in Electronics & Communication Engg (Sanctioned Intake: 120)',
    '  Program: B.Tech in Mechanical Engineering (Sanctioned Intake: 120)',
    '  Program: Master of Business Administration - MBA (Sanctioned Intake: 120)',
    '',
    'Terms and Conditions:',
    '1. The institution shall strictly adhere to the examination and academic regulations of AKTU.',
    '2. Extension of approval from AICTE for the session 2026-27 is mandatory before final admissions.',
    '3. Faculty ratio must conform to the norms prescribed by AICTE and UGC.',
    '4. All admissions shall be made strictly through UPSEE / JEE counselling or sanctioned quota.',
  ];

  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 8.5, font: line.startsWith('  Program') ? fontBold : fontRegular, color: rgb(0.2, 0.2, 0.2) });
    y -= 14;
  }

  y -= 50;
  page.drawRectangle({ x: width - 240, y: y - 50, width: 190, height: 65, borderWidth: 1, borderColor: rgb(0.2, 0.4, 0.7), color: rgb(0.96, 0.98, 1) });
  page.drawText('DIGITALLY SIGNED WITH DSC', { x: width - 225, y: y + 2, size: 8, font: fontBold, color: rgb(0.1, 0.4, 0.8) });
  page.drawText('REGISTRAR, AKTU LUCKNOW', { x: width - 225, y: y - 12, size: 8.5, font: fontBold });
  page.drawText('Cryptographic Token: X.509 RFC 3161', { x: width - 225, y: y - 24, size: 7.5, font: fontRegular });
  page.drawText('Verified via Controller of Examination Portal', { x: width - 225, y: y - 36, size: 7, font: fontRegular });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'AKTU_Affiliation_Extension_2025_26.pdf'), pdfBytes);
}

async function createRectifiedFireSafetyReceipt(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderWidth: 2, borderColor: rgb(0.1, 0.5, 0.2) });

  let y = height - 60;
  page.drawText('UTTAR PRADESH FIRE SERVICES DIRECTORATE', { x: 155, y, size: 13, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 16;
  page.drawText('CITIZEN E-PORTAL (NIVESH MITRA SINGLE WINDOW)', { x: 160, y, size: 10, font: fontBold, color: rgb(0.1, 0.5, 0.2) });
  y -= 14;
  page.drawText('FIRE SAFETY NOC RENEWAL APPLICATION - ACKNOWLEDGMENT RECEIPT', { x: 110, y, size: 9, font: fontBold });

  y -= 25;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 25;
  page.drawText('Receipt Ref: UP/FIRE/RNW/2026/894109', { x: 50, y, size: 10, font: fontBold });
  page.drawText('Filing Date: 22-Oct-2026 14:22 IST', { x: width - 220, y, size: 10, font: fontBold });

  y -= 30;
  page.drawRectangle({ x: 45, y: y - 100, width: width - 90, height: 110, color: rgb(0.97, 0.99, 0.97), borderWidth: 1, borderColor: rgb(0.7, 0.9, 0.7) });
  page.drawText('INSTITUTIONAL APPLICATION DETAILS:', { x: 55, y: y - 5, size: 9, font: fontBold, color: rgb(0.1, 0.5, 0.2) });
  page.drawText('Applicant: Apex Institute of Technology & Management (PID: 1-102938475)', { x: 55, y: y - 20, size: 8.5, font: fontRegular });
  page.drawText('Existing NOC No: UP/FS/GBN/2025/NOC-49210 (Expiring 15-Nov-2026)', { x: 55, y: y - 35, size: 8.5, font: fontRegular });
  page.drawText('Renewal Fee Remitted: Rs. 15,000/- (SBI E-Pay Transaction ID: 26102289410)', { x: 55, y: y - 50, size: 8.5, font: fontRegular });
  page.drawText('Scheduled Joint Inspection Date: 28-Oct-2026 (Assigned Officer: DFO Zone 2)', { x: 55, y: y - 65, size: 8.5, font: fontBold, color: rgb(0.1, 0.4, 0.7) });
  page.drawText('Status: In Progress - Renewal Undertaking Valid under APH Clause 4.6', { x: 55, y: y - 80, size: 8.5, font: fontBold, color: rgb(0.1, 0.5, 0.2) });

  y -= 130;
  page.drawText('COUNCIL SCRUTINY NOTICE COMPLIANCE DECLARATION:', { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 15;
  const notes = [
    'This acknowledgment is submitted to the AICTE Northern Regional Office Scrutiny Committee',
    'in response to Notice Ref: NOT-1029.',
    '',
    'Institutional Undertaking:',
    'We hereby undertake that the physical fire safety systems on our campus are 100% operational,',
    'and that the final renewal certificate from the Chief Fire Officer shall be uploaded immediately',
    'upon completion of the inspection scheduled on 28-Oct-2026.',
  ];

  for (const n of notes) {
    page.drawText(n, { x: 50, y, size: 8.5, font: n.startsWith('We hereby') ? fontBold : fontRegular, color: rgb(0.2, 0.2, 0.2) });
    y -= 14;
  }

  y -= 40;
  page.drawText('Principal & Secretary, Apex Educational Trust', { x: 50, y, size: 8.5, font: fontBold });
  page.drawText('DSC Endorsed: 22-Oct-2026', { x: 50, y: y - 12, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Rectified_Fire_Safety_NOC_Renewal.pdf'), pdfBytes);
}

async function createPWDSafetyCertificate(docsDir) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 25, y: 25, width: width - 50, height: height - 50, borderWidth: 1.5, borderColor: rgb(0.2, 0.3, 0.5) });

  let y = height - 60;
  page.drawText('PUBLIC WORKS DEPARTMENT (BUILDING DIVISION)', { x: 135, y, size: 13, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 16;
  page.drawText('GOVERNMENT OF UTTAR PRADESH, GAUTAM BUDDHA NAGAR', { x: 130, y, size: 9.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  y -= 25;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 25;
  page.drawText('Certificate No: UP/PWD/BLD/2024/7821', { x: 50, y, size: 10, font: fontBold });
  page.drawText('Date of Verification: 19-May-2024', { x: width - 210, y, size: 10, font: fontBold });

  y -= 30;
  page.drawText('STRUCTURAL SOUNDNESS & ARCHITECTURAL CARPET AREA CERTIFICATE', { x: 80, y, size: 11, font: fontBold, color: rgb(0.1, 0.3, 0.6) });

  y -= 30;
  const lines = [
    'This is to certify that the institutional building complex constructed on Plot 402/1, Knowledge Park III,',
    'Greater Noida, housing Apex Institute of Technology & Management, has been inspected by the',
    'Executive Engineer (Civil), State PWD Division on 14-May-2024.',
    '',
    'SUMMARY OF EVALUATED INFRASTRUCTURE NORMS (AICTE APH 2024-27):',
    '• Total Instructional Carpet Area (Classrooms, Labs, Workshops): 16,840 Sq. Meters',
    '• Total Administrative Area (Offices, Boardroom, Principal Chamber): 2,420 Sq. Meters',
    '• Amenities Area (Auditorium, Cafeteria, Sports, Medical Center): 3,850 Sq. Meters',
    '• Circulation & Common Area (Corridors, Staircases, Lobbies): 6,240 Sq. Meters',
    '• Gross Built-Up Area Constructed: 29,350 Sq. Meters (Approved FAR 1.5)',
    '',
    'STRUCTURAL STABILITY & SAFETY DECLARATION:',
    '1. The structure is designed and constructed in RCC frame conforming to IS 456:2000 and IS 1893:2016',
    '   (Seismic Zone IV earthquake resistance compliance).',
    '2. Barrier-free environment provided with ramps, tactile floor paths, and dedicated lifts for Divyangjan.',
    '3. Building stability is certified safe and structurally sound for heavy student occupancy.',
  ];

  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 8.5, font: line.startsWith('•') || line.startsWith('SUMMARY') || line.startsWith('STRUCTURAL') ? fontBold : fontRegular, color: rgb(0.2, 0.2, 0.2) });
    y -= 14;
  }

  y -= 50;
  page.drawRectangle({ x: width - 240, y: y - 50, width: 190, height: 65, borderWidth: 1, borderColor: rgb(0.2, 0.4, 0.7), color: rgb(0.96, 0.98, 1) });
  page.drawText('EXECUTIVE ENGINEER (BUILDINGS)', { x: width - 230, y: y + 2, size: 8.5, font: fontBold, color: rgb(0.1, 0.3, 0.6) });
  page.drawText('Public Works Department, UP Division', { x: width - 230, y: y - 12, size: 7.5, font: fontRegular });
  page.drawText('Approval Seal: PWD-GBN-ENG-491', { x: width - 230, y: y - 24, size: 7.5, font: fontBold, color: rgb(0.1, 0.5, 0.2) });
  page.drawText('Digital Signature Verified', { x: width - 230, y: y - 36, size: 7, font: fontRegular });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Building_Safety_PWD_Certificate.pdf'), pdfBytes);
}

async function main() {
  const docsDir = path.join(process.cwd(), 'public', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  console.log('Generating realistic demo documents in:', docsDir);
  await createFireSafetyNOC(docsDir);
  console.log('✓ Created Fire_Safety_NOC_StateDirectorate.pdf');
  await createFacultyCadreRoster(docsDir);
  console.log('✓ Created Faculty_Aadhaar_Form16_AuditedList.pdf');
  await createLandTitleDeed(docsDir);
  console.log('✓ Created Land_Title_Khasra_Deed_Registered.pdf');
  await createAKTUContinuanceLetter(docsDir);
  console.log('✓ Created AKTU_Affiliation_Extension_2025_26.pdf');
  await createRectifiedFireSafetyReceipt(docsDir);
  console.log('✓ Created Rectified_Fire_Safety_NOC_Renewal.pdf');
  await createPWDSafetyCertificate(docsDir);
  console.log('✓ Created Building_Safety_PWD_Certificate.pdf');
  console.log('All statutory demo documents generated successfully!');
}

main().catch(err => {
  console.error('Error generating demo documents:', err);
  process.exit(1);
});
