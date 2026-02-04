/**
 * Create Admin User Script
 * Melisa - Dubai, UAE
 *
 * Usage: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')

  const email = 'admin@melisa.ae'
  const password = 'Melisa@2024'
  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   ID: ${user.id}`)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
