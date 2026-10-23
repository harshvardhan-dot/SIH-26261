import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const records = db.prepare(`
      SELECT vr.*, d.filename as document_name, d.type as document_type,
             a.category as app_category, i.name as institution_name, i.code as institution_code
      FROM verification_records vr
      LEFT JOIN documents d ON vr.document_id = d.id
      LEFT JOIN applications a ON vr.application_id = a.id
      LEFT JOIN institutions i ON a.institution_id = i.id
      ORDER BY vr.created_at DESC
      LIMIT 100
    `).all();

    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified_count,
        SUM(CASE WHEN status = 'mismatch' THEN 1 ELSE 0 END) as mismatch_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_count,
        SUM(CASE WHEN status = 'source_unavailable' THEN 1 ELSE 0 END) as unavailable_count,
        SUM(CASE WHEN status = 'manual_review' THEN 1 ELSE 0 END) as manual_count
      FROM verification_records
    `).get();

    const bySources = db.prepare(`
      SELECT source, source_type, COUNT(*) as total,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN status = 'mismatch' THEN 1 ELSE 0 END) as mismatch,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM verification_records
      GROUP BY source
      ORDER BY total DESC
    `).all();

    return NextResponse.json({ records, stats, bySources });
  } catch (error) {
    console.error('Verification API error:', error);
    return NextResponse.json({ error: 'Failed to fetch verification data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Verification record ID required' }, { status: 400 });
    }

    const newStatus = status || 'verified';
    const now = new Date().toISOString();
    const crypto = require('crypto');
    const mockHash = 'SHA256:' + crypto.randomBytes(16).toString('hex');

    db.prepare(`
      UPDATE verification_records
      SET status = ?, verified_at = ?, notes = ?,
          response_data = json_set(COALESCE(response_data, '{}'), '$.proof_hash', ?, '$.verified_timestamp', ?)
      WHERE id = ?
    `).run(newStatus, now, notes || 'Verified via issuing authority digital interface gateway', mockHash, now, id);

    const record = db.prepare('SELECT * FROM verification_records WHERE id = ?').get(id) as { application_id?: string; source?: string } | undefined;

    if (record) {
      const auditId = 'aud_' + crypto.randomUUID().slice(0, 8);
      db.prepare(`
        INSERT INTO audit_log (id, user_id, application_id, action, module, details, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        auditId,
        'u_admin1',
        record.application_id || 'GENERAL',
        `Authority verification updated to '${newStatus}' via ${record.source}`,
        'verification',
        JSON.stringify({ recordId: id, status: newStatus, proofHash: mockHash }),
        '10.24.0.8',
        now
      );
    }

    return NextResponse.json({ success: true, id, status: newStatus, verified_at: now, proofHash: mockHash });
  } catch (error) {
    console.error('Verification POST error:', error);
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}

