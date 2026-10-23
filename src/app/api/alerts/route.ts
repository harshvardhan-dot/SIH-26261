import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const resolved = searchParams.get('resolved');
    const appId = searchParams.get('application_id');

    let query = `
      SELECT al.*, a.category as app_category, i.name as institution_name, i.code as institution_code
      FROM alerts al
      LEFT JOIN applications a ON al.application_id = a.id
      LEFT JOIN institutions i ON a.institution_id = i.id
    `;

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (severity && severity !== 'all') {
      whereClauses.push('al.severity = ?');
      params.push(severity);
    }
    if (resolved !== null && resolved !== undefined && resolved !== 'all') {
      whereClauses.push('al.resolved = ?');
      params.push(resolved === 'true' || resolved === '1' ? 1 : 0);
    }
    if (appId) {
      whereClauses.push('al.application_id = ?');
      params.push(appId);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY al.created_at DESC LIMIT 100`;

    const alerts = db.prepare(query).all(...params);

    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN resolved = 0 THEN 1 ELSE 0 END) as unresolved,
        SUM(CASE WHEN resolved = 1 THEN 1 ELSE 0 END) as resolved_count,
        SUM(CASE WHEN severity = 'critical' AND resolved = 0 THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN severity = 'warning' AND resolved = 0 THEN 1 ELSE 0 END) as warning_count
      FROM alerts
    `).get();

    return NextResponse.json({ alerts, stats });
  } catch (error) {
    console.error('Alerts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, resolved, resolved_by } = body;

    if (!id) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    const isResolved = resolved !== false ? 1 : 0;
    const now = new Date().toISOString();
    const resolver = resolved_by || 'Dr. Rajesh Kumar';

    db.prepare(`
      UPDATE alerts
      SET resolved = ?, resolved_by = ?, resolved_at = ?
      WHERE id = ?
    `).run(isResolved, resolver, now, id);

    return NextResponse.json({ success: true, id, resolved: isResolved, resolved_at: now });
  } catch (error) {
    console.error('Alerts PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}
