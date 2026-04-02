import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { translations } from '../translations.ts';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, 'app.db'));

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );
    
    CREATE TABLE IF NOT EXISTS content (
      lang TEXT PRIMARY KEY,
      data TEXT
    );
  `);

  // Insert default admin
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', 'admin', 'admin');
  }

  // Insert default content if empty
  const enContent = db.prepare('SELECT lang FROM content WHERE lang = ?').get('en');
  if (!enContent) {
    db.prepare('INSERT INTO content (lang, data) VALUES (?, ?)').run('en', JSON.stringify(translations.en));
  }
  const amContent = db.prepare('SELECT lang FROM content WHERE lang = ?').get('am');
  if (!amContent) {
    db.prepare('INSERT INTO content (lang, data) VALUES (?, ?)').run('am', JSON.stringify(translations.am));
  }

  // Migration for contact info
  const contents = db.prepare('SELECT lang, data FROM content').all() as { lang: string, data: string }[];
  for (const row of contents) {
    const data = JSON.parse(row.data);
    let changed = false;
    if (data.footer) {
      if (data.footer.phone && !data.footer.phones) {
        data.footer.phones = [data.footer.phone];
        delete data.footer.phone;
        changed = true;
      }
      if (data.footer.email && !data.footer.emails) {
        data.footer.emails = [data.footer.email];
        delete data.footer.email;
        changed = true;
      }
      if (data.footer.address && !data.footer.addresses) {
        data.footer.addresses = [data.footer.address];
        delete data.footer.address;
        changed = true;
      }
    }
    if (changed) {
      db.prepare('UPDATE content SET data = ? WHERE lang = ?').run(JSON.stringify(data), row.lang);
    }
  }
}

export default db;
