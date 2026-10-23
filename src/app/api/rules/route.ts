import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = 'SELECT * FROM regulatory_rules';
    const params: string[] = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY category, requirement';

    const rules = db.prepare(query).all(...params);
    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Rules GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, mandatory, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Rule ID required' }, { status: 400 });
    }

    db.prepare(`
      UPDATE regulatory_rules
      SET mandatory = COALESCE(?, mandatory),
          description = COALESCE(?, description)
      WHERE id = ?
    `).run(mandatory !== undefined ? (mandatory ? 1 : 0) : null, description || null, id);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Rules PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}
