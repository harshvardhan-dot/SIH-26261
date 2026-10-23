import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  const db = getDb();

  // Check if already seeded
  const count = db.prepare('SELECT COUNT(*) as c FROM institutions').get() as { c: number };
  if (count.c > 0) return;

  // Seed Users
  const users = [
    { id: uuidv4(), name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@aicte.gov.in', role: 'admin', department: 'Approval Bureau' },
    { id: uuidv4(), name: 'Priya Sharma', email: 'priya.sharma@aicte.gov.in', role: 'reviewer', department: 'Compliance Division' },
    { id: uuidv4(), name: 'Amit Patel', email: 'amit.patel@aicte.gov.in', role: 'reviewer', department: 'Document Verification' },
    { id: uuidv4(), name: 'Dr. Sunita Verma', email: 'sunita.verma@aicte.gov.in', role: 'senior_reviewer', department: 'Quality Assurance' },
    { id: uuidv4(), name: 'Vikram Singh', email: 'vikram.singh@aicte.gov.in', role: 'inspector', department: 'Field Inspection' },
  ];

  const insertUser = db.prepare('INSERT INTO users (id, name, email, role, department) VALUES (?, ?, ?, ?, ?)');
  users.forEach(u => insertUser.run(u.id, u.name, u.email, u.role, u.department));

  // Seed Institutions
  const institutions = [
    { id: uuidv4(), name: 'Indian Institute of Technology, Delhi', code: 'IITD-001', state: 'Delhi', city: 'New Delhi', type: 'Government', established_year: 1961, university_affiliation: 'Autonomous' },
    { id: uuidv4(), name: 'Rajiv Gandhi Technical University', code: 'RGTU-045', state: 'Madhya Pradesh', city: 'Bhopal', type: 'State University', established_year: 1998, university_affiliation: 'Self' },
    { id: uuidv4(), name: 'Shri Ram College of Engineering', code: 'SRCE-112', state: 'Uttar Pradesh', city: 'Lucknow', type: 'Private', established_year: 2005, university_affiliation: 'AKTU' },
    { id: uuidv4(), name: 'Bangalore Institute of Technology', code: 'BIT-078', state: 'Karnataka', city: 'Bangalore', type: 'Private-Aided', established_year: 1979, university_affiliation: 'VTU' },
    { id: uuidv4(), name: 'Maharashtra Engineering College', code: 'MEC-203', state: 'Maharashtra', city: 'Pune', type: 'Private', established_year: 2010, university_affiliation: 'SPPU' },
    { id: uuidv4(), name: 'Chennai Technical Institute', code: 'CTI-156', state: 'Tamil Nadu', city: 'Chennai', type: 'Private', established_year: 2003, university_affiliation: 'Anna University' },
    { id: uuidv4(), name: 'Gujarat Polytechnic College', code: 'GPC-089', state: 'Gujarat', city: 'Ahmedabad', type: 'Government', established_year: 1985, university_affiliation: 'GTU' },
    { id: uuidv4(), name: 'Hyderabad School of Management', code: 'HSM-234', state: 'Telangana', city: 'Hyderabad', type: 'Private', established_year: 2012, university_affiliation: 'JNTUH' },
    { id: uuidv4(), name: 'Punjab Engineering Academy', code: 'PEA-067', state: 'Punjab', city: 'Chandigarh', type: 'Private-Aided', established_year: 1995, university_affiliation: 'PTU' },
    { id: uuidv4(), name: 'Kolkata Institute of Science', code: 'KIS-178', state: 'West Bengal', city: 'Kolkata', type: 'Private', established_year: 2008, university_affiliation: 'MAKAUT' },
    { id: uuidv4(), name: 'Rajasthan Technical College', code: 'RTC-290', state: 'Rajasthan', city: 'Jaipur', type: 'Government', established_year: 1972, university_affiliation: 'RTU' },
    { id: uuidv4(), name: 'Kerala School of Architecture', code: 'KSA-145', state: 'Kerala', city: 'Thiruvananthapuram', type: 'Private', established_year: 2015, university_affiliation: 'KTU' },
  ];

  const insertInst = db.prepare('INSERT INTO institutions (id, name, code, state, city, type, established_year, university_affiliation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  institutions.forEach(i => insertInst.run(i.id, i.name, i.code, i.state, i.city, i.type, i.established_year, i.university_affiliation));

  // Seed Applications
  const categories = ['Extension of Approval', 'New Institution', 'New Course', 'Increase in Intake', 'Change in Site', 'Closure of Institution'];
  const statuses = ['submitted', 'under_review', 'validated', 'verification_pending', 'verified', 'compliance_check', 'approved', 'rejected', 'flagged'];
  const priorities = ['low', 'normal', 'high', 'urgent'];

  const applications: Array<{id: string; institution_id: string; category: string; status: string; priority: string; submitted_at: string; assigned_to: string; validation_score: number; anomaly_count: number; verification_status: string; compliance_score: number; academic_year: string}> = [];

  institutions.forEach((inst, idx) => {
    const numApps = 1 + (idx % 3);
    for (let i = 0; i < numApps; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const app = {
        id: uuidv4(),
        institution_id: inst.id,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        submitted_at: date.toISOString(),
        assigned_to: users[Math.floor(Math.random() * users.length)].id,
        validation_score: Math.round((60 + Math.random() * 40) * 10) / 10,
        anomaly_count: Math.floor(Math.random() * 5),
        verification_status: ['pending', 'in_progress', 'completed', 'failed'][Math.floor(Math.random() * 4)],
        compliance_score: Math.round((50 + Math.random() * 50) * 10) / 10,
        academic_year: '2026-2027',
      };
      applications.push(app);
    }
  });

  const insertApp = db.prepare('INSERT INTO applications (id, institution_id, category, status, priority, submitted_at, assigned_to, validation_score, anomaly_count, verification_status, compliance_score, academic_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  applications.forEach(a => insertApp.run(a.id, a.institution_id, a.category, a.status, a.priority, a.submitted_at, a.assigned_to, a.validation_score, a.anomaly_count, a.verification_status, a.compliance_score, a.academic_year));

  // Seed Documents for each application
  const docTypes = [
    'affidavit', 'noc_state_govt', 'land_document', 'building_plan', 'fire_safety_cert',
    'accreditation_cert', 'faculty_list', 'financial_statement', 'fee_receipt',
    'university_affiliation_letter', 'trust_deed', 'eoa_previous', 'infrastructure_photos',
    'lab_equipment_list', 'anti_ragging_affidavit', 'sc_st_committee_report'
  ];
  const docStatuses = ['valid', 'expired', 'missing', 'under_review', 'rejected', 'verified'];

  const insertDoc = db.prepare('INSERT INTO documents (id, application_id, type, filename, file_size, mime_type, status, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    const numDocs = 6 + Math.floor(Math.random() * 8);
    const usedTypes = new Set<string>();
    for (let i = 0; i < numDocs; i++) {
      let docType = docTypes[Math.floor(Math.random() * docTypes.length)];
      while (usedTypes.has(docType) && usedTypes.size < docTypes.length) {
        docType = docTypes[Math.floor(Math.random() * docTypes.length)];
      }
      usedTypes.add(docType);
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 24) - 6);
      insertDoc.run(
        uuidv4(), app.id, docType,
        `${docType}_${app.id.slice(0, 8)}.pdf`,
        Math.floor(Math.random() * 5000000) + 100000,
        'application/pdf',
        docStatuses[Math.floor(Math.random() * docStatuses.length)],
        expiryDate.toISOString()
      );
    }
  });

  // Seed Validation Results
  const validationRules = [
    { name: 'Institution Name Consistency', severity: 'high' },
    { name: 'Document Expiry Check', severity: 'critical' },
    { name: 'Mandatory Document Presence', severity: 'critical' },
    { name: 'Field Completeness', severity: 'medium' },
    { name: 'Date Format Validation', severity: 'low' },
    { name: 'Cross-Reference Check', severity: 'high' },
    { name: 'Signature Verification', severity: 'high' },
    { name: 'Affidavit Format Compliance', severity: 'medium' },
  ];

  const insertValidation = db.prepare('INSERT INTO validation_results (id, application_id, rule_name, status, severity, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    validationRules.forEach(rule => {
      const passed = Math.random() > 0.3;
      insertValidation.run(
        uuidv4(), app.id, rule.name,
        passed ? 'passed' : (Math.random() > 0.5 ? 'failed' : 'warning'),
        rule.severity,
        passed ? `${rule.name} check passed successfully` : `${rule.name} check identified issues requiring review`,
        app.submitted_at
      );
    });
  });

  // Seed Anomaly Flags
  const anomalyTypes = [
    { type: 'metadata_mismatch', title: 'Document Metadata Inconsistency', desc: 'Creation date in metadata does not match the document date printed on the certificate.' },
    { type: 'duplicate_document', title: 'Potential Duplicate Document', desc: 'Document hash matches another submission from a different institution.' },
    { type: 'font_inconsistency', title: 'Font/Formatting Irregularity', desc: 'Multiple font types detected in what should be a single-format official document.' },
    { type: 'date_anomaly', title: 'Suspicious Date Pattern', desc: 'Document dates appear to be altered or inconsistent with expected chronological order.' },
    { type: 'stamp_irregularity', title: 'Official Stamp Irregularity', desc: 'Official stamp or seal appears inconsistent with known authentic formats.' },
    { type: 'signature_mismatch', title: 'Signature Pattern Mismatch', desc: 'Signature on this document differs significantly from other documents signed by the same authority.' },
  ];

  const insertAnomaly = db.prepare('INSERT INTO anomaly_flags (id, application_id, type, severity, title, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    const numAnomalies = Math.floor(Math.random() * 4);
    for (let i = 0; i < numAnomalies; i++) {
      const anomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
      insertAnomaly.run(
        uuidv4(), app.id, anomaly.type,
        ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        anomaly.title, anomaly.desc,
        ['open', 'investigating', 'resolved', 'false_positive'][Math.floor(Math.random() * 4)],
        app.submitted_at
      );
    }
  });

  // Seed Verification Records
  const sources = [
    { source: 'DigiLocker', type: 'api' },
    { source: 'UGC Portal', type: 'portal' },
    { source: 'State Government Portal', type: 'portal' },
    { source: 'National Academic Depository', type: 'api' },
    { source: 'Fire Department Records', type: 'manual' },
    { source: 'Land Registry Office', type: 'portal' },
    { source: 'University Verification', type: 'api' },
  ];

  const insertVerification = db.prepare('INSERT INTO verification_records (id, application_id, source, source_type, status, created_at) VALUES (?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    const numVerifications = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numVerifications; i++) {
      const src = sources[Math.floor(Math.random() * sources.length)];
      insertVerification.run(
        uuidv4(), app.id, src.source, src.type,
        ['verified', 'mismatch', 'expired', 'pending', 'source_unavailable', 'manual_review'][Math.floor(Math.random() * 6)],
        app.submitted_at
      );
    }
  });

  // Seed Compliance Checks
  const complianceCategories = [
    { category: 'Infrastructure', requirements: ['Minimum land area (as per norms)', 'Building plan approved by competent authority', 'Separate administrative block', 'Library with minimum books/journals', 'Computer center with internet'] },
    { category: 'Faculty', requirements: ['Minimum faculty-student ratio', 'Faculty qualification compliance', 'Regular faculty appointed', 'Faculty development programs', 'PhD holders ratio'] },
    { category: 'Laboratory', requirements: ['Equipped laboratories as per curriculum', 'Lab equipment inventory maintained', 'Lab safety measures in place', 'Workshop facilities available'] },
    { category: 'Governance', requirements: ['Governing body constituted', 'Anti-ragging committee formed', 'Grievance redressal committee', 'Internal quality assurance cell', 'SC/ST committee formed'] },
    { category: 'Financial', requirements: ['FDR as per norms', 'Fee structure approved', 'Audited financial statements', 'No pending statutory dues'] },
  ];

  const insertCompliance = db.prepare('INSERT INTO compliance_checks (id, application_id, category, requirement, status, severity) VALUES (?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    complianceCategories.forEach(cat => {
      cat.requirements.forEach(req => {
        insertCompliance.run(
          uuidv4(), app.id, cat.category, req,
          ['compliant', 'non_compliant', 'partially_compliant', 'pending', 'not_applicable'][Math.floor(Math.random() * 5)],
          Math.random() > 0.3 ? 'required' : 'recommended'
        );
      });
    });
  });

  // Seed Audit Log
  const actions = [
    'Application submitted', 'Document uploaded', 'Validation initiated', 'Anomaly detected',
    'Verification requested', 'Compliance check started', 'Status updated', 'Review assigned',
    'Document re-uploaded', 'Alert generated', 'Manual review completed'
  ];

  const insertAudit = db.prepare('INSERT INTO audit_log (id, user_id, application_id, action, module, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    const numLogs = 3 + Math.floor(Math.random() * 8);
    for (let i = 0; i < numLogs; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const action = actions[Math.floor(Math.random() * actions.length)];
      insertAudit.run(
        uuidv4(),
        users[Math.floor(Math.random() * users.length)].id,
        app.id, action,
        ['validation', 'anomaly', 'verification', 'compliance', 'system'][Math.floor(Math.random() * 5)],
        `${action} for application ${app.id.slice(0, 8)}`,
        date.toISOString()
      );
    }
  });

  // Seed Alerts
  const alertTypes = [
    { type: 'missing_document', title: 'Missing Required Document', message: 'Fire Safety Certificate is missing from the submission.' },
    { type: 'expired_document', title: 'Expired Document Detected', message: 'NOC from State Government has expired 3 months ago.' },
    { type: 'anomaly_detected', title: 'Document Anomaly Flagged', message: 'Potential metadata inconsistency detected in submitted affidavit.' },
    { type: 'verification_failed', title: 'Verification Mismatch', message: 'DigiLocker verification returned mismatched institution details.' },
    { type: 'compliance_gap', title: 'Compliance Deficiency', message: 'Faculty-student ratio does not meet minimum prescribed norms.' },
    { type: 'pending_action', title: 'Pending Review Action', message: 'Application awaiting reviewer assignment for more than 7 days.' },
  ];

  const insertAlert = db.prepare('INSERT INTO alerts (id, application_id, type, severity, title, message, resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  applications.forEach(app => {
    const numAlerts = Math.floor(Math.random() * 3);
    for (let i = 0; i < numAlerts; i++) {
      const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const daysAgo = Math.floor(Math.random() * 14);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      insertAlert.run(
        uuidv4(), app.id, alert.type,
        ['info', 'warning', 'error', 'critical'][Math.floor(Math.random() * 4)],
        alert.title, alert.message,
        Math.random() > 0.6 ? 1 : 0,
        date.toISOString()
      );
    }
  });

  // Seed Regulatory Rules
  const rules = [
    { category: 'Extension of Approval', requirement: 'Valid EoA for current academic year', description: 'Institution must have valid Extension of Approval for the current academic year', mandatory: 1 },
    { category: 'Extension of Approval', requirement: 'Compliance with previous conditions', description: 'All conditions imposed during previous approval must be fulfilled', mandatory: 1 },
    { category: 'Extension of Approval', requirement: 'No pending legal cases', description: 'Institution should not have any pending legal cases against AICTE orders', mandatory: 1 },
    { category: 'New Institution', requirement: 'Land ownership proof', description: 'Minimum land area with valid ownership/lease documents', mandatory: 1 },
    { category: 'New Institution', requirement: 'Building readiness certificate', description: 'Building should be ready as per approved plans', mandatory: 1 },
    { category: 'New Course', requirement: 'Faculty recruitment proof', description: 'Qualified faculty appointed as per AICTE norms for the proposed course', mandatory: 1 },
    { category: 'New Course', requirement: 'Laboratory infrastructure', description: 'Adequate laboratory facilities for the proposed course', mandatory: 1 },
    { category: 'Increase in Intake', requirement: 'Infrastructure proportionality', description: 'Infrastructure should be proportional to proposed increased intake', mandatory: 1 },
    { category: 'All', requirement: 'Anti-ragging measures', description: 'Compliance with UGC anti-ragging regulations', mandatory: 1 },
    { category: 'All', requirement: 'Mandatory disclosure', description: 'Updated mandatory disclosure on institution website', mandatory: 1 },
  ];

  const insertRule = db.prepare('INSERT INTO regulatory_rules (id, category, requirement, description, mandatory) VALUES (?, ?, ?, ?, ?)');
  rules.forEach(r => insertRule.run(uuidv4(), r.category, r.requirement, r.description, r.mandatory));
}
