import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const checks = db.prepare(`
      SELECT cc.*, a.category as app_category, i.name as institution_name
      FROM compliance_checks cc
      LEFT JOIN applications a ON cc.application_id = a.id
      LEFT JOIN institutions i ON a.institution_id = i.id
      ORDER BY cc.category, cc.requirement
      LIMIT 200
    `).all();

    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'compliant' THEN 1 ELSE 0 END) as compliant_count,
        SUM(CASE WHEN status = 'non_compliant' THEN 1 ELSE 0 END) as non_compliant_count,
        SUM(CASE WHEN status = 'partially_compliant' THEN 1 ELSE 0 END) as partial_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'not_applicable' THEN 1 ELSE 0 END) as na_count
      FROM compliance_checks
    `).get();

    const byCategory = db.prepare(`
      SELECT category, COUNT(*) as total,
        SUM(CASE WHEN status = 'compliant' THEN 1 ELSE 0 END) as compliant,
        SUM(CASE WHEN status = 'non_compliant' THEN 1 ELSE 0 END) as non_compliant,
        SUM(CASE WHEN status = 'partially_compliant' THEN 1 ELSE 0 END) as partial,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM compliance_checks
      GROUP BY category
    `).all();

    const rules = db.prepare('SELECT * FROM regulatory_rules ORDER BY category').all();

    return NextResponse.json({ checks, stats, byCategory, rules });
  } catch (error) {
    console.error('Compliance API error:', error);
    return NextResponse.json({ error: 'Failed to fetch compliance data' }, { status: 500 });
  }
}
