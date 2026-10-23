import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const module = searchParams.get('module');
    const appId = searchParams.get('application_id');

    let whereClause = '1=1';
    const params: string[] = [];

    if (module && module !== 'all') {
      whereClause += ' AND al.module = ?';
      params.push(module);
    }
    if (appId) {
      whereClause += ' AND al.application_id = ?';
      params.push(appId);
    }

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM audit_log al WHERE ${whereClause}
    `).get(...params) as { count: number };

    const logs = db.prepare(`
      SELECT al.*, u.name as user_name, u.role as user_role,
             a.category as app_category, i.name as institution_name
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN applications a ON al.application_id = a.id
      LEFT JOIN institutions i ON a.institution_id = i.id
      WHERE ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    return NextResponse.json({
      logs,
      pagination: { total: total.count, page, limit, totalPages: Math.ceil(total.count / limit) }
    });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
