import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'photos.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new sqlite3.Database(dbPath)

// Promisify database methods
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

// Initialize database
export async function initDatabase() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      customName TEXT,
      description TEXT,
      dateTaken TEXT NOT NULL,
      uploadDate TEXT NOT NULL,
      filePath TEXT NOT NULL,
      thumbnailPath TEXT,
      fileSize INTEGER NOT NULL,
      width INTEGER,
      height INTEGER
    )
  `)
}

export { dbRun, dbGet, dbAll }
