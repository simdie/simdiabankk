import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany()
  for (const user of users) {
    if (!user.displayId || user.displayId.length !== 11) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const random6 = Array.from({length:6}, () =>
        chars[Math.floor(Math.random()*chars.length)]).join('')
      const year = new Date(user.createdAt).getFullYear().toString().slice(-2)
      const displayId = `BOA${year}${random6}`
      await prisma.user.update({
        where: { id: user.id },
        data: { displayId }
      })
      console.log(`Updated ${user.email}: ${displayId}`)
    }
  }
}

main().then(() => prisma.$disconnect())
