import Database, { Database as BetterSqlite3Database } from "better-sqlite3";

const db: BetterSqlite3Database = new Database("database.db", {});

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS GoodFitKeyValuePairs (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  )
`
).run();

export default db;

interface KeyValueRow {
  key: string;
  value: string;
}

export function retrieveValue(key: string): string | undefined {
  const row = db
    .prepare("SELECT * FROM GoodFitKeyValuePairs WHERE key = ?")
    .get(key) as KeyValueRow | undefined;
  if (row) {
    return row.value;
  }
  return undefined;
}

export function setKeyValue(key: string, value: string): void {
  const curValue = db
    .prepare("SELECT * FROM GoodFitKeyValuePairs WHERE key = ?")
    .get(key);
  if (curValue) {
    db.prepare("UPDATE GoodFitKeyValuePairs SET value = ? WHERE key = ?").run(
      value,
      key
    );
  } else {
    db.prepare(
      "INSERT INTO GoodFitKeyValuePairs (key, value) VALUES (?, ?)"
    ).run(key, value);
  }
}
