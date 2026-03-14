import prisma from "../lib/prisma"

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, createdAt: true, displayId: true } })
  let updated = 0
  for (const user of users) {
    if (!user.displayId) {
      const year = new Date(user.createdAt).getFullYear()
      const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
      await prisma.user.update({
        where: { id: user.id },
        data: { displayId: `BOA-${year}-${rand}` }
      })
      updated++
    }
  }
  console.log(`Updated ${updated} users with displayId`)
  await prisma.$disconnect()
}

main().catch(console.error)
