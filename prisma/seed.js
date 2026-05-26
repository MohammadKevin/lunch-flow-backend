require('dotenv').config()

const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

  const admin = await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
    update: {},
    create: {
      fullName: process.env.ADMIN_FULLNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
      phone: process.env.ADMIN_PHONE,
    },
  })

  console.log('Admin created:')
  console.log(admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })