import { bootstrapDatabase } from "../db/bootstrap";
import { getSharedPool } from "../db/pool";

async function run() {
  const pool = getSharedPool();
  await bootstrapDatabase(pool);
  await pool.end();
  console.log("Database bootstrapped.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
