import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (typeof databaseUrl !== "string" || databaseUrl.length === 0) {
  throw new Error("DATABASE_URL must be set before Prisma is initialized");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;