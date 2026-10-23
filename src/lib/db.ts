import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'aicte.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'reviewer',
      department TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE,
      state TEXT,
      city TEXT,
      type TEXT,
      established_year INTEGER,
      university_affiliation TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      institution_id TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'submitted',
      priority TEXT DEFAULT 'normal',
      submitted_at TEXT DEFAULT (datetime('now')),
      assigned_to TEXT,
      validation_score REAL,
      anomaly_count INTEGER DEFAULT 0,
      verification_status TEXT DEFAULT 'pending',
      compliance_score REAL,
      notes TEXT,
      academic_year TEXT,
      FOREIGN KEY (institution_id) REFERENCES institutions(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      type TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      upload_date TEXT DEFAULT (datetime('now')),
      expiry_date TEXT,
      ocr_data TEXT,
      extracted_fields TEXT,
      hash TEXT,
      FOREIGN KEY (application_id) REFERENCES applications(id)
    );

    CREATE TABLE IF NOT EXISTS validation_results (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      document_id TEXT,
      rule_id TEXT,
      rule_name TEXT,
      status TEXT NOT NULL,
      severity TEXT DEFAULT 'info',
      details TEXT,
      evidence TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (application_id) REFERENCES applications(id),
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );

    CREATE TABLE IF NOT EXISTS anomaly_flags (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      document_id TEXT,
      type TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'medium',
      title TEXT NOT NULL,
      description TEXT,
      evidence TEXT,
      status TEXT DEFAULT 'open',
      reviewed_by TEXT,
      reviewed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (application_id) REFERENCES applications(id),
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );

    CREATE TABLE IF NOT EXISTS verification_records (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      document_id TEXT,
      source TEXT NOT NULL,
      source_type TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      request_data TEXT,
      response_data TEXT,
      verified_at TEXT,
      expires_at TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (application_id) REFERENCES applications(id),
      FOREIGN KEY (document_id) REFERENCES documents(id)
    );

    CREATE TABLE IF NOT EXISTS compliance_checks (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      category TEXT NOT NULL,
      requirement TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      evidence TEXT,
      notes TEXT,
      severity TEXT DEFAULT 'required',
      checked_at TEXT,
      FOREIGN KEY (application_id) REFERENCES applications(id)
    );

    CREATE TABLE IF NOT EXISTS regulatory_rules (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      requirement TEXT NOT NULL,
      description TEXT,
      mandatory INTEGER DEFAULT 1,
      applicable_categories TEXT,
      document_types TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      application_id TEXT,
      action TEXT NOT NULL,
      module TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      application_id TEXT,
      type TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'info',
      title TEXT NOT NULL,
      message TEXT,
      resolved INTEGER DEFAULT 0,
      resolved_by TEXT,
      resolved_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (application_id) REFERENCES applications(id)
    );
  `);
}
