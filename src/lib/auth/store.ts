import fs from "fs";
import path from "path";
import type { AuthDb } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "auth-db.json");

const EMPTY_DB: AuthDb = { users: [], otpChallenges: [] };

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readDb(): AuthDb {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2), "utf-8");
    return structuredClone(EMPTY_DB);
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AuthDb>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      otpChallenges: Array.isArray(parsed.otpChallenges) ? parsed.otpChallenges : [],
    };
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

export function writeDb(db: AuthDb) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function updateDb(mutator: (db: AuthDb) => void) {
  const db = readDb();
  mutator(db);
  writeDb(db);
  return db;
}
