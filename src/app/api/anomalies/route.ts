import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('application_id');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    let query = `
      SELECT af.*, d.filename as document_name, d.type as document_type,
             a.category as app_category, i.name as institution_name
      FROM anomaly_flags af
      LEFT JOIN documents d ON af.document_id = d.id
      LEFT JOIN applications a ON af.application_id = a.id
      LEFT JOIN institutions i ON a.institution_id = i.id
    `;

    const whereClauses: string[] = [];
    const params: string[] = [];

    if (appId) {
      whereClauses.push('af.application_id = ?');
      params.push(appId);
    }
    if (severity && severity !== 'all') {
      whereClauses.push('af.severity = ?');
      params.push(severity);
    }
    if (status && status !== 'all') {
      whereClauses.push('af.status = ?');
      params.push(status);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY af.created_at DESC LIMIT 100`;
    const results = db.prepare(query).all(...params);

    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN status = 'investigating' THEN 1 ELSE 0 END) as investigating_count,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count,
        SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_count,
        SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) as low_count
      FROM anomaly_flags
    `).get();

    return NextResponse.json({ anomalies: results, stats });
  } catch (error) {
    console.error('Anomalies API error:', error);
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, status, reviewed_by, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Anomaly ID and status required' }, { status: 400 });
    }

    const reviewer = reviewed_by || 'Dr. Rajesh Kumar';
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE anomaly_flags
      SET status = ?, reviewed_by = ?, reviewed_at = ?,
          description = CASE WHEN ? != '' THEN description || ' [Review Note: ' || ? || ']' ELSE description END
      WHERE id = ?
    `).run(status, reviewer, now, notes || '', notes || '', id);

    // Fetch updated record for audit
    const anomaly = db.prepare('SELECT * FROM anomaly_flags WHERE id = ?').get(id) as { application_id?: string; title?: string } | undefined;

    if (anomaly) {
      const crypto = require('crypto');
      const auditId = 'aud_' + crypto.randomUUID().slice(0, 8);
      db.prepare(`
        INSERT INTO audit_log (id, user_id, application_id, action, module, details, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        auditId,
        'u_admin1',
        anomaly.application_id || 'GENERAL',
        `Anomaly flagged as '${status}' (${anomaly.title})`,
        'anomaly',
        JSON.stringify({ anomalyId: id, status, reviewer, notes }),
        '10.24.0.8',
        now
      );
    }

    return NextResponse.json({ success: true, id, status, reviewed_at: now });
  } catch (error) {
    console.error('Anomaly PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update anomaly' }, { status: 500 });
  }
}
