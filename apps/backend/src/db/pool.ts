import { Pool } from "pg";

import { env } from "../config/env";

export type Queryable = Pick<Pool, "query">;

let sharedPool: Pool | null = null;

export function createPool() {
  return new Pool({
    connectionString: env.databaseUrl,
    max: env.isProduction ? 20 : 10,
  });
}

export function getSharedPool() {
  if (!sharedPool) {
    sharedPool = createPool();
  }

  return sharedPool;
}
