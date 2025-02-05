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
