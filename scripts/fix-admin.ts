import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter } as any);

prisma.user.update({
  where: { email: "admin@boasiaonline.com" },
  data: { role: "ADMIN", status: "ACTIVE" },
}).then((u) => {
  console.log("✓ Admin fixed:", u.email, "role:", u.role);
}).finally(() => prisma.$disconnect());
