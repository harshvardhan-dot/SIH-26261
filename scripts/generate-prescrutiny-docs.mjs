import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function createExpiredFireSafetyNOC(docsDir) {
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
    borderColor: rgb(0.7, 0.1, 0.1), // Red border for expired
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

  y -= 22;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 22;
  page.drawText('Dispatch No: UP/FS/GBN/2024/NOC-EXP-31048', { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Date of Issue: 15-May-2024', { x: width - 200, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

  y -= 30;
  // Expired Warning Banner across document
  page.drawRectangle({ x: 50, y: y - 10, width: width - 100, height: 32, color: rgb(1, 0.92, 0.92), borderWidth: 1.5, borderColor: rgb(0.85, 0.15, 0.15) });
  page.drawText('STATUTORY FIRE SAFETY NO OBJECTION CERTIFICATE', { x: 140, y: y + 8, size: 11, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('STATUS: EXPIRED ON 14-MAY-2025 • DEFICIENT FOR AY 2026-27 (APH REGULATION 3.4)', { x: 80, y: y - 4, size: 8, font: fontBold, color: rgb(0.85, 0.15, 0.15) });

  y -= 45;
  page.drawText('TO WHOMSOEVER IT MAY CONCERN', { x: 210, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

  y -= 25;
  const lines = [
    '1. This is to certify that the educational premises of:',
    '   APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT',
    '   Plot No. 402/1, Knowledge Park III, Greater Noida, District Gautam Buddha Nagar (U.P.)',
    '   AICTE Permanent Institute ID: 1-102938475',
    '',
    '2. The academic, administrative, and laboratory blocks (Ground + 4 floors)',
    '   were inspected by the Divisional Fire Officer on 10-May-2024 as per NBC 2016 Part 4.',
    '',
    '3. Fire Fighting Equipment & Emergency Systems Recorded:',
    '   • Wet Riser & Down-comer system: Operational during 2024 inspection.',
    '   • Yard Hydrants & Hose Reels: Installed across floors.',
    '   • Dedicated Static Water Tank: 1,50,000 Litres.',
    '   • Terrace Overhead Tank: 25,000 Litres.',
    '   • Serviced Fire Extinguishers: 140 units (Last inspected May 2024).',
    '',
    '4. MANDATORY STATUTORY EXPIRY NOTICE (CRITICAL):',
    '   This certificate was strictly valid for ONE YEAR ONLY from date of issue:',
    '   VALIDITY PERIOD: 15-May-2024 to 14-May-2025 (EXPIRED).',
    '   THIS NOC HAS LAPSED AND IS NULL & VOID FOR ACADEMIC YEAR 2026-27.',
    '   Under AICTE APH Regulation 3.4, approval cannot be granted on a lapsed clearance.',
  ];

  for (const line of lines) {
    if (line.startsWith('   APEX')) {
      page.drawText(line, { x: 50, y, size: 10, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
    } else if (line.includes('EXPIRED') || line.includes('LAPSED') || line.includes('NULL & VOID')) {
      page.drawText(line, { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.85, 0.15, 0.15) });
    } else {
      page.drawText(line, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    }
    y -= 15;
  }

  y -= 25;

  // Stamp and Signature Box with EXPIRED Watermark
  page.drawRectangle({ x: width - 240, y: y - 55, width: 190, height: 70, borderWidth: 1, borderColor: rgb(0.8, 0.2, 0.2), color: rgb(1, 0.96, 0.96) });
  page.drawText('DOCUMENT STATUS: LAPSED', { x: width - 225, y: y + 2, size: 8, font: fontBold, color: rgb(0.8, 0.1, 0.1) });
  page.drawText('CHIEF FIRE OFFICER (RECORDS)', { x: width - 225, y: y - 10, size: 9, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('Fire Division, Gautam Buddha Nagar', { x: width - 225, y: y - 22, size: 7.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Expired Date: 14-May-2025 (Overdue)', { x: width - 225, y: y - 34, size: 7, font: fontBold, color: rgb(0.8, 0.1, 0.1) });
  page.drawText('Digital Seal: UPFS:ARCHIVE:EXP-2024-918', { x: width - 225, y: y - 46, size: 6.5, font: fontOblique, color: rgb(0.4, 0.4, 0.4) });

  // QR Code Box Placeholder
  page.drawRectangle({ x: 50, y: y - 55, width: 70, height: 70, borderWidth: 1, borderColor: rgb(0.8, 0.2, 0.2), color: rgb(1, 0.95, 0.95) });
  page.drawText('[ LAPSED QR ]', { x: 54, y: y - 18, size: 7.5, font: fontBold, color: rgb(0.8, 0.1, 0.1) });
  page.drawText('Scan indicates:', { x: 54, y: y - 30, size: 6.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText('EXPIRED RECORD', { x: 52, y: y - 42, size: 6.5, font: fontBold, color: rgb(0.8, 0.1, 0.1) });

  // Footer
  page.drawText('Page 1 of 1 • Pre-Scrutiny Demonstration Sample: Date Lapsed Certificate (AICTE APH 2024-27)', { x: 75, y: 35, size: 7.5, font: fontOblique, color: rgb(0.7, 0.2, 0.2) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Fire_Safety_NOC_EXPIRED.pdf'), pdfBytes);
}

async function createValidFireSafetyNOC(docsDir) {
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
    borderColor: rgb(0.06, 0.4, 0.16), // Green border for valid
  });

  // Inner Border
  page.drawRectangle({
    x: 29,
    y: 29,
    width: width - 58,
    height: height - 58,
    borderWidth: 0.5,
    borderColor: rgb(0.1, 0.6, 0.2),
  });

  // Header Tricolor Accent Bar
  page.drawRectangle({ x: 30, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(1, 0.6, 0.2) });
  page.drawRectangle({ x: 30 + (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.05, 0.1, 0.5) });
  page.drawRectangle({ x: 30 + 2 * (width - 60) / 3, y: height - 36, width: (width - 60) / 3, height: 4, color: rgb(0.07, 0.53, 0.03) });

  let y = height - 70;

  // Header
  page.drawText('GOVERNMENT OF UTTAR PRADESH', { x: 180, y, size: 13, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  y -= 18;
  page.drawText('DIRECTORATE OF FIRE & EMERGENCY SERVICES', { x: 140, y, size: 15, font: fontBold, color: rgb(0.06, 0.45, 0.16) });
  y -= 15;
  page.drawText('OFFICE OF THE CHIEF FIRE OFFICER, DISTRICT GAUTAM BUDDHA NAGAR', { x: 105, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  y -= 22;
  page.drawLine({ start: { x: 45, y }, end: { x: width - 45, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

  y -= 22;
  page.drawText('Dispatch No: UP/FS/GBN/2026/NOC-VAL-98421', { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Date of Issue: 24-Oct-2026', { x: width - 200, y, size: 10, font: fontBold, color: rgb(0.06, 0.45, 0.16) });

  y -= 30;
  // Valid Banner across document
  page.drawRectangle({ x: 50, y: y - 10, width: width - 100, height: 32, color: rgb(0.92, 0.99, 0.94), borderWidth: 1.5, borderColor: rgb(0.1, 0.6, 0.2) });
  page.drawText('STATUTORY FIRE SAFETY NO OBJECTION CERTIFICATE', { x: 140, y: y + 8, size: 11, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('STATUS: VALID & ACTIVE THROUGH 30-JUN-2027 • FULL COVERAGE FOR AY 2026-27 (COMPLIANT)', { x: 65, y: y - 4, size: 8, font: fontBold, color: rgb(0.06, 0.45, 0.16) });

  y -= 45;
  page.drawText('TO WHOMSOEVER IT MAY CONCERN', { x: 210, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

  y -= 25;
  const lines = [
    '1. This is to certify that the educational premises of:',
    '   APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT',
    '   Plot No. 402/1, Knowledge Park III, Greater Noida, District Gautam Buddha Nagar (U.P.)',
    '   AICTE Permanent Institute ID: 1-102938475',
    '',
    '2. The multi-storey blocks comprising Ground + 4 floors and laboratories were thoroughly',
    '   re-inspected on 06-Oct-2026 as per National Building Code (NBC 2016 Part 4) provisions.',
    '',
    '3. Fire Fighting Equipment & Infrastructure Verified in Full Working Condition:',
    '   • Main Electric Pump: 2850 LPM capacity & automated diesel standby engine operational.',
    '   • Yard Hydrants & Hose Reels: Pressure verified at 3.5 kg/cm2 across all upper floors.',
    '   • Dedicated Static Water Tank: 1,50,000 Litres underground + 30,000 Litres terrace overhead.',
    '   • Serviced Fire Extinguishers: 140 ABC & Clean Agent extinguishers inspected and tagged.',
    '   • Emergency Exit Signage & Clear Stairwells: 100% compliant with evacuation norms.',
    '',
    '4. STATUTORY VALIDITY ENDORSEMENT:',
    '   This No Objection Certificate is valid for Academic Year 2026-27 up to 30-JUNE-2027.',
    '   The clearance is UNBROKEN and strictly adheres to AICTE Approval Process Handbook (Regulation 3.4).',
    '   Digital verification token has been issued to the AICTE Scrutiny Committee Gateway.',
  ];

  for (const line of lines) {
    if (line.startsWith('   APEX')) {
      page.drawText(line, { x: 50, y, size: 10, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
    } else if (line.includes('30-JUNE-2027') || line.includes('UNBROKEN') || line.includes('COMPLIANT')) {
      page.drawText(line, { x: 50, y, size: 9.5, font: fontBold, color: rgb(0.06, 0.45, 0.16) });
    } else {
      page.drawText(line, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    }
    y -= 15;
  }

  y -= 25;

  // Stamp and Signature Box with VALID Seal
  page.drawRectangle({ x: width - 240, y: y - 55, width: 190, height: 70, borderWidth: 1, borderColor: rgb(0.1, 0.6, 0.2), color: rgb(0.96, 1, 0.96) });
  page.drawText('VERIFIED & DIGITALLY ENDORSED', { x: width - 225, y: y + 2, size: 8, font: fontBold, color: rgb(0.06, 0.5, 0.2) });
  page.drawText('CHIEF FIRE OFFICER', { x: width - 225, y: y - 10, size: 9, font: fontBold, color: rgb(0.06, 0.16, 0.26) });
  page.drawText('Fire Division, Gautam Buddha Nagar', { x: width - 225, y: y - 22, size: 7.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Valid Through: 30-Jun-2027 (Active)', { x: width - 225, y: y - 34, size: 7, font: fontBold, color: rgb(0.06, 0.5, 0.2) });
  page.drawText('Digital Token: 2026:UPFS:DSC:VALID:77810A', { x: width - 225, y: y - 46, size: 6.5, font: fontOblique, color: rgb(0.4, 0.4, 0.4) });

  // QR Code Box Placeholder
  page.drawRectangle({ x: 50, y: y - 55, width: 70, height: 70, borderWidth: 1, borderColor: rgb(0.1, 0.6, 0.2), color: rgb(0.95, 1, 0.95) });
  page.drawText('[ VALID QR ]', { x: 56, y: y - 18, size: 7.5, font: fontBold, color: rgb(0.06, 0.5, 0.2) });
  page.drawText('DigiLocker Tier 1', { x: 53, y: y - 30, size: 6.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('VERIFIED SEAL', { x: 53, y: y - 42, size: 6.5, font: fontBold, color: rgb(0.06, 0.5, 0.2) });

  // Footer
  page.drawText('Page 1 of 1 • Pre-Scrutiny Demonstration Sample: Valid Certificate (AICTE APH 2024-27 Reg 3.4)', { x: 75, y: 35, size: 7.5, font: fontOblique, color: rgb(0.1, 0.4, 0.2) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(docsDir, 'Fire_Safety_NOC_VALID.pdf'), pdfBytes);
}

async function main() {
  const docsDir = path.join(process.cwd(), 'public', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  console.log('Generating Pre-Scrutiny Demo Documents in:', docsDir);
  await createExpiredFireSafetyNOC(docsDir);
  console.log('✓ Created Fire_Safety_NOC_EXPIRED.pdf (Expired on 14-May-2025)');
  await createValidFireSafetyNOC(docsDir);
  console.log('✓ Created Fire_Safety_NOC_VALID.pdf (Valid through 30-Jun-2027)');
}

main().catch(err => {
  console.error('Error generating docs:', err);
  process.exit(1);
});
