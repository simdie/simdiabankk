import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL bypasses PgBouncer — required for schema push & migrations
    // At runtime, PrismaClient reads DATABASE_URL from environment directly
    url: process.env["DIRECT_URL"],
  },
});
