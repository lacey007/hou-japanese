import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

const globalDb = globalThis as unknown as { japaneseDb?: DatabaseSync };
export function getDb() {
  if (globalDb.japaneseDb) return globalDb.japaneseDb;
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "japanese.db"));
  db.exec(`
  CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT NOT NULL,
    surface TEXT NOT NULL,
    reading TEXT NOT NULL,
    meaning TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, surface)
  );
  CREATE TABLE IF NOT EXISTS progress (
    lesson_id TEXT PRIMARY KEY,
    position REAL NOT NULL DEFAULT 0,
    percent INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS business_annotations (
    text TEXT PRIMARY KEY,
    reading TEXT NOT NULL,
    meaning TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_vocabulary_created_at ON vocabulary(created_at DESC);
`);
  db.exec("PRAGMA optimize;");
  globalDb.japaneseDb = db;
  return db;
}
