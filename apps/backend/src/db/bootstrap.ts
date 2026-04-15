import { readFile } from "fs/promises";
import path from "path";

import type { Queryable } from "./pool";

export async function bootstrapDatabase(db: Queryable) {
  const candidates = [
    path.join(process.cwd(), "database"),
    path.join(process.cwd(), "..", "..", "database"),
  ];

  let databaseDir = candidates[0];
  for (const candidate of candidates) {
    try {
      await readFile(path.join(candidate, "schema.sql"), "utf8");
      databaseDir = candidate;
      break;
    } catch {
      // Try the next candidate.
    }
  }

  const schema = await readFile(path.join(databaseDir, "schema.sql"), "utf8");
  const seeds = await readFile(path.join(databaseDir, "seeds", "seed.sql"), "utf8");

  await db.query(schema);
  await db.query(seeds);
}
