import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params: string[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    if (category && category !== 'all') {
      whereClause += ' AND a.category = ?';
      params.push(category);
    }
    if (search) {
      whereClause += ' AND (i.name LIKE ? OR i.code LIKE ? OR a.id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countQuery = db.prepare(`
      SELECT COUNT(*) as total
      FROM applications a
      JOIN institutions i ON a.institution_id = i.id
      WHERE ${whereClause}
    `);

    const dataQuery = db.prepare(`
      SELECT a.*, i.name as institution_name, i.code as institution_code,
             i.state, i.city, i.type as institution_type,
             u.name as assigned_to_name,
             (SELECT COUNT(*) FROM documents d WHERE d.application_id = a.id) as doc_count,
             (SELECT COUNT(*) FROM anomaly_flags af WHERE af.application_id = a.id AND af.status = 'open') as open_anomalies,
             (SELECT COUNT(*) FROM alerts al WHERE al.application_id = a.id AND al.resolved = 0) as unresolved_alerts
      FROM applications a
      JOIN institutions i ON a.institution_id = i.id
      LEFT JOIN users u ON a.assigned_to = u.id
      WHERE ${whereClause}
      ORDER BY a.submitted_at DESC
      LIMIT ? OFFSET ?
    `);

    const totalResult = countQuery.get(...params) as { total: number };
    const applications = dataQuery.all(...params, limit, offset);

    return NextResponse.json({
      applications,
      pagination: {
        total: totalResult.total,
        page,
        limit,
        totalPages: Math.ceil(totalResult.total / limit),
      }
    });
  } catch (error) {
    console.error('Applications API error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
