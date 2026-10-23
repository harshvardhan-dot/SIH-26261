import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    seedDatabase();
    const db = getDb();
    const { id } = await params;

    const application = db.prepare(`
      SELECT a.*, i.name as institution_name, i.code as institution_code,
             i.state, i.city, i.type as institution_type, i.established_year,
             i.university_affiliation, i.contact_email, i.contact_phone, i.address,
             u.name as assigned_to_name, u.email as assigned_to_email
      FROM applications a
      JOIN institutions i ON a.institution_id = i.id
      LEFT JOIN users u ON a.assigned_to = u.id
      WHERE a.id = ?
    `).get(id);

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const documents = db.prepare(`
      SELECT * FROM documents WHERE application_id = ? ORDER BY upload_date DESC
    `).all(id);

    const validationResults = db.prepare(`
      SELECT * FROM validation_results WHERE application_id = ? ORDER BY created_at DESC
    `).all(id);

    const anomalyFlags = db.prepare(`
      SELECT * FROM anomaly_flags WHERE application_id = ? ORDER BY created_at DESC
    `).all(id);

    const verificationRecords = db.prepare(`
      SELECT * FROM verification_records WHERE application_id = ? ORDER BY created_at DESC
    `).all(id);

    const complianceChecks = db.prepare(`
      SELECT * FROM compliance_checks WHERE application_id = ? ORDER BY category, requirement
    `).all(id);

    const auditLog = db.prepare(`
      SELECT al.*, u.name as user_name
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.application_id = ?
      ORDER BY al.created_at DESC
      LIMIT 50
    `).all(id);

    const alerts = db.prepare(`
      SELECT * FROM alerts WHERE application_id = ? ORDER BY created_at DESC
    `).all(id);

    return NextResponse.json({
      application,
      documents,
      validationResults,
      anomalyFlags,
      verificationRecords,
      complianceChecks,
      auditLog,
      alerts,
    });
  } catch (error) {
    console.error('Application detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch application details' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    const { status, notes, reviewer } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const current = db.prepare('SELECT * FROM applications WHERE id = ?').get(id) as { status: string } | undefined;
    if (!current) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE applications
      SET status = ?, notes = CASE WHEN ? != '' THEN ? ELSE notes END
      WHERE id = ?
    `).run(status, notes || '', notes || '', id);

    const crypto = require('crypto');
    const auditId = 'aud_' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO audit_log (id, user_id, application_id, action, module, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      auditId,
      'u_admin1',
      id,
      `Status changed from ${current.status} to ${status}`,
      'applications',
      JSON.stringify({ from: current.status, to: status, notes, reviewer: reviewer || 'Dr. Rajesh Kumar' }),
      '10.24.0.8',
      now
    );

    return NextResponse.json({ success: true, id, status, updated_at: now });
  } catch (error) {
    console.error('Application PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

