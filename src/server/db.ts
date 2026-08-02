import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { translations } from '../translations.ts';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'app.db');

let dbInstance: InstanceType<typeof Database> | null = null;

function removeCorruptDbFiles() {
  try {
    if (dbInstance) {
      try { dbInstance.close(); } catch {}
      dbInstance = null;
    }
    const files = [dbPath, `${dbPath}-wal`, `${dbPath}-shm`];
    for (const f of files) {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    }
    console.log('Removed corrupt SQLite database files successfully.');
  } catch (err) {
    console.error('Failed to remove corrupt SQLite database files:', err);
  }
}

export function getDb(): InstanceType<typeof Database> {
  if (!dbInstance) {
    try {
      dbInstance = new Database(dbPath);
      dbInstance.pragma('journal_mode = WAL');
    } catch (err) {
      console.error('Error opening SQLite database, attempting reset:', err);
      removeCorruptDbFiles();
      dbInstance = new Database(dbPath);
      dbInstance.pragma('journal_mode = WAL');
    }
  }
  return dbInstance;
}

export function initDb() {
  try {
    runInitSchema();
  } catch (err: any) {
    console.error('Failed to initialize SQLite DB:', err);
    if (err?.code === 'SQLITE_CORRUPT' || String(err).includes('malformed')) {
      console.warn('SQLite database disk image is malformed. Recovering with fresh database...');
      removeCorruptDbFiles();
      runInitSchema();
    }
  }
}

function runInitSchema() {
  const currentDb = getDb();
  currentDb.exec(`
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
  const adminExists = currentDb.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    currentDb.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', 'admin', 'admin');
  }

  // Insert default content if empty
  const enContent = currentDb.prepare('SELECT lang FROM content WHERE lang = ?').get('en');
  if (!enContent) {
    currentDb.prepare('INSERT INTO content (lang, data) VALUES (?, ?)').run('en', JSON.stringify(translations.en));
  }
  const amContent = currentDb.prepare('SELECT lang FROM content WHERE lang = ?').get('am');
  if (!amContent) {
    currentDb.prepare('INSERT INTO content (lang, data) VALUES (?, ?)').run('am', JSON.stringify(translations.am));
  }

  // Migration for contact info
  const contents = currentDb.prepare('SELECT lang, data FROM content').all() as { lang: string, data: string }[];
  for (const row of contents) {
    try {
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
        currentDb.prepare('UPDATE content SET data = ? WHERE lang = ?').run(JSON.stringify(data), row.lang);
      }
    } catch {}
  }
}

// Export proxy object so existing imports of default export `db` continue working seamlessly with error recovery
const dbProxy = new Proxy({} as InstanceType<typeof Database>, {
  get(_target, prop) {
    const instance = getDb();
    const value = (instance as any)[prop];
    if (typeof value === 'function') {
      return function (...args: any[]) {
        try {
          return value.apply(instance, args);
        } catch (err: any) {
          if (err?.code === 'SQLITE_CORRUPT' || String(err).includes('malformed')) {
            console.error('SQLITE_CORRUPT encountered during query execution, recreating DB:', err);
            removeCorruptDbFiles();
            initDb();
            const freshInstance = getDb();
            const freshFn = (freshInstance as any)[prop];
            return freshFn.apply(freshInstance, args);
          }
          throw err;
        }
      };
    }
    return value;
  }
});

export default dbProxy;

