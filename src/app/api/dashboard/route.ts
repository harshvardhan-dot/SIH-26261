import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    // Get summary stats
    const totalApps = db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number };
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count FROM applications GROUP BY status
    `).all() as Array<{ status: string; count: number }>;
    const categoryCounts = db.prepare(`
      SELECT category, COUNT(*) as count FROM applications GROUP BY category ORDER BY count DESC
    `).all() as Array<{ category: string; count: number }>;
    const priorityCounts = db.prepare(`
      SELECT priority, COUNT(*) as count FROM applications GROUP BY priority
    `).all() as Array<{ priority: string; count: number }>;

    // Anomaly stats
    const totalAnomalies = db.prepare("SELECT COUNT(*) as count FROM anomaly_flags WHERE status = 'open'").get() as { count: number };
    const anomalySeverity = db.prepare(`
      SELECT severity, COUNT(*) as count FROM anomaly_flags WHERE status = 'open' GROUP BY severity
    `).all() as Array<{ severity: string; count: number }>;

    // Verification stats
    const verificationStats = db.prepare(`
      SELECT status, COUNT(*) as count FROM verification_records GROUP BY status
    `).all() as Array<{ status: string; count: number }>;

    // Compliance stats
    const complianceStats = db.prepare(`
      SELECT status, COUNT(*) as count FROM compliance_checks GROUP BY status
    `).all() as Array<{ status: string; count: number }>;

    // Document stats
    const docStats = db.prepare(`
      SELECT status, COUNT(*) as count FROM documents GROUP BY status
    `).all() as Array<{ status: string; count: number }>;

    // Recent alerts
    const recentAlerts = db.prepare(`
      SELECT a.*, app.category as app_category, i.name as institution_name
      FROM alerts a
      LEFT JOIN applications app ON a.application_id = app.id
      LEFT JOIN institutions i ON app.institution_id = i.id
      WHERE a.resolved = 0
      ORDER BY a.created_at DESC
      LIMIT 10
    `).all();

    // Weekly trends (simulated)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      weeklyData.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toISOString().split('T')[0],
        submitted: Math.floor(Math.random() * 8) + 2,
        validated: Math.floor(Math.random() * 6) + 1,
        verified: Math.floor(Math.random() * 4) + 1,
        flagged: Math.floor(Math.random() * 3),
      });
    }

    // Average scores
    const avgValidation = db.prepare('SELECT AVG(validation_score) as avg FROM applications WHERE validation_score IS NOT NULL').get() as { avg: number };
    const avgCompliance = db.prepare('SELECT AVG(compliance_score) as avg FROM applications WHERE compliance_score IS NOT NULL').get() as { avg: number };

    return NextResponse.json({
      totalApplications: totalApps.count,
      statusBreakdown: statusCounts,
      categoryBreakdown: categoryCounts,
      priorityBreakdown: priorityCounts,
      openAnomalies: totalAnomalies.count,
      anomalySeverity,
      verificationStats,
      complianceStats,
      documentStats: docStats,
      recentAlerts,
      weeklyTrends: weeklyData,
      avgValidationScore: Math.round((avgValidation.avg || 0) * 10) / 10,
      avgComplianceScore: Math.round((avgCompliance.avg || 0) * 10) / 10,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
