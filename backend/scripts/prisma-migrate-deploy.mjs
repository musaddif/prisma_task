/**
 * Production-safe migrate deploy with Prisma baselining for P3005.
 *
 * If the database already has tables but no migration history (P3005),
 * marks `0_init` as applied without running its SQL, then deploys any
 * later migrations. Never resets or drops existing data.
 */
import { spawnSync } from "node:child_process";

const BASELINE_MIGRATION = "0_init";

function runPrisma(args) {
  const result = spawnSync("npx", ["prisma", ...args], {
    encoding: "utf8",
    shell: true,
    env: process.env,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  return {
    status: result.status ?? 1,
    output: `${result.stdout || ""}\n${result.stderr || ""}`,
  };
}

function deploy() {
  return runPrisma(["migrate", "deploy"]);
}

const first = deploy();
if (first.status === 0) {
  process.exit(0);
}

if (!first.output.includes("P3005")) {
  process.exit(first.status);
}

console.log(
  `P3005 detected: non-empty database with no migration history. Marking "${BASELINE_MIGRATION}" as already applied (no SQL executed)...`
);

const resolved = runPrisma([
  "migrate",
  "resolve",
  "--applied",
  BASELINE_MIGRATION,
]);

if (resolved.status !== 0) {
  process.exit(resolved.status);
}

console.log("Baseline recorded. Running prisma migrate deploy for pending migrations...");
const second = deploy();
process.exit(second.status);
