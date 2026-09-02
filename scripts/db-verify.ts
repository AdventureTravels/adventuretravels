/**
 * Telt vóór en na een migratie wat er in de database staat, zodat je het
 * verschil ziet voordat je op productie migreert. Werkt op het v4- én het
 * v5-schema (raw SQL, kijkt welke tabellen bestaan).
 *
 *   npm run db:verify -- before   → schrijft .db-verify/before.json
 *   npm run db:verify -- after    → schrijft .db-verify/after.json en toont het verschil
 *
 * Zonder label: "before" als die nog niet bestaat, anders "after".
 */
import { PrismaClient } from "@prisma/client";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();
const DIR = join(process.cwd(), ".db-verify");

type Snapshot = {
  takenAt: string;
  schema: "v4" | "v5";
  counts: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  bookings: { id: string; number: string; status: string; trip: string; participants: number; invoices: number }[];
  trips: { slug: string; status: string; partner: string | null }[];
};

async function tableExists(name: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<{ exists: string | null }[]>(`SELECT to_regclass('"${name}"')::text AS exists`);
  return rows[0]?.exists !== null;
}

async function count(sql: string): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ n: bigint | number }[]>(sql);
  return Number(rows[0]?.n ?? 0);
}

async function snapshot(): Promise<Snapshot> {
  const v5 = await tableExists("Booking");
  const bookingTable = v5 ? "Booking" : "BookingRequest";

  const counts: Record<string, number> = {
    reizen: await count(`SELECT count(*) AS n FROM "Trip"`),
    boekingen: await count(`SELECT count(*) AS n FROM "${bookingTable}"`),
    deelnemers: await count(`SELECT count(*) AS n FROM "Participant"`),
    facturen: await count(`SELECT count(*) AS n FROM "Invoice"`),
    reviews: await count(`SELECT count(*) AS n FROM "Review"`),
    partners: (await tableExists("Partner")) ? await count(`SELECT count(*) AS n FROM "Partner"`) : 0,
    gidsen: (await tableExists("Guide")) ? await count(`SELECT count(*) AS n FROM "Guide"`) : 0,
    deelnemers_zonder_boeking: await count(
      `SELECT count(*) AS n FROM "Participant" p WHERE NOT EXISTS (SELECT 1 FROM "${bookingTable}" b WHERE b."id" = p."bookingId")`
    ),
    facturen_zonder_boeking: await count(
      `SELECT count(*) AS n FROM "Invoice" i WHERE NOT EXISTS (SELECT 1 FROM "${bookingTable}" b WHERE b."id" = i."bookingId")`
    ),
  };

  const statusRows = await prisma.$queryRawUnsafe<{ status: string; n: bigint }[]>(
    `SELECT "status", count(*) AS n FROM "${bookingTable}" GROUP BY "status" ORDER BY "status"`
  );
  const bookingsByStatus = Object.fromEntries(statusRows.map((r) => [r.status, Number(r.n)]));

  const bookings = await prisma.$queryRawUnsafe<Snapshot["bookings"][number][]>(`
    SELECT b."id", COALESCE(b."bookingNumber", b."id") AS "number", b."status", t."title" AS trip,
           (SELECT count(*) FROM "Participant" p WHERE p."bookingId" = b."id")::int AS participants,
           (SELECT count(*) FROM "Invoice" i WHERE i."bookingId" = b."id")::int AS invoices
    FROM "${bookingTable}" b JOIN "Trip" t ON t."id" = b."tripId"
    ORDER BY b."createdAt"`);

  const trips = v5
    ? await prisma.$queryRawUnsafe<Snapshot["trips"]>(
        `SELECT t."slug", t."status", p."name" AS partner FROM "Trip" t LEFT JOIN "Partner" p ON p."id" = t."partnerId" ORDER BY t."order"`
      )
    : (await prisma.$queryRawUnsafe<{ slug: string }[]>(`SELECT "slug" FROM "Trip" ORDER BY "order"`)).map((t) => ({
        slug: t.slug,
        status: "(v4: geen status)",
        partner: null,
      }));

  return { takenAt: new Date().toISOString(), schema: v5 ? "v5" : "v4", counts, bookingsByStatus, bookings, trips };
}

function printSnapshot(label: string, s: Snapshot) {
  console.log(`\n=== ${label} (${s.schema}, ${s.takenAt}) ===`);
  console.table(s.counts);
  console.log("Boekingen per status:");
  console.table(s.bookingsByStatus);
  console.log("Reizen:");
  console.table(s.trips);
  console.log("Boekingen:");
  console.table(s.bookings);
}

function printDiff(before: Snapshot, after: Snapshot) {
  console.log("\n=== Verschil before → after ===");
  const keys = Array.from(new Set([...Object.keys(before.counts), ...Object.keys(after.counts)]));
  console.table(
    Object.fromEntries(
      keys.map((k) => [k, { before: before.counts[k] ?? 0, after: after.counts[k] ?? 0, verschil: (after.counts[k] ?? 0) - (before.counts[k] ?? 0) }])
    )
  );
  const statuses = Array.from(new Set([...Object.keys(before.bookingsByStatus), ...Object.keys(after.bookingsByStatus)]));
  console.log("Boekingen per status:");
  console.table(Object.fromEntries(statuses.map((k) => [k, { before: before.bookingsByStatus[k] ?? 0, after: after.bookingsByStatus[k] ?? 0 }])));

  const problems: string[] = [];
  if (before.counts.boekingen !== after.counts.boekingen) problems.push("Aantal boekingen verschilt.");
  if (before.counts.deelnemers !== after.counts.deelnemers) problems.push("Aantal deelnemers verschilt.");
  if (before.counts.facturen !== after.counts.facturen) problems.push("Aantal facturen verschilt.");
  if (before.counts.reizen !== after.counts.reizen) problems.push("Aantal reizen verschilt.");
  if (after.counts.deelnemers_zonder_boeking > 0 || after.counts.facturen_zonder_boeking > 0) problems.push("Er zijn wezen (deelnemers/facturen zonder boeking).");
  // Match op id; oude snapshots zonder id vallen terug op nummer (of id-als-nummer).
  const missing = before.bookings.filter(
    (b) => !after.bookings.some((a) => a.id === b.id || a.id === b.number || a.number === b.number)
  );
  if (missing.length) problems.push(`Boekingen niet teruggevonden: ${missing.map((b) => b.number).join(", ")}`);
  const notCancelled = after.bookings.filter((a) => a.status !== "cancelled");
  if (after.schema === "v5" && notCancelled.length) problems.push(`Gemigreerde boekingen niet op "cancelled": ${notCancelled.map((b) => b.number).join(", ")}`);

  console.log(problems.length ? `\n! ${problems.join("\n! ")}` : "\nOK: alle boekingen, deelnemers en facturen zijn er nog; reviews uit de v4-seed vervallen bewust.");
}

async function main() {
  mkdirSync(DIR, { recursive: true });
  const beforePath = join(DIR, "before.json");
  const afterPath = join(DIR, "after.json");
  const label = process.argv[2] ?? (existsSync(beforePath) ? "after" : "before");

  const snap = await snapshot();
  const path = label === "after" ? afterPath : beforePath;
  writeFileSync(path, JSON.stringify(snap, null, 2));
  printSnapshot(label, snap);
  console.log(`\nOpgeslagen in ${path}`);

  if (label === "after" && existsSync(beforePath)) {
    printDiff(JSON.parse(readFileSync(beforePath, "utf8")), snap);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
