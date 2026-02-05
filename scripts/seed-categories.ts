import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  // PAGA
  {
    nameFa: 'PAGA',
    nameEn: 'PAGA',
    slug: 'paga',
    children: [
      {
        nameFa: 'Controllers & System Modules',
        nameEn: 'Controllers & System Modules',
        slug: 'controllers-system-modules',
        children: [
          { nameFa: 'DS-6', nameEn: 'DS-6', slug: 'ds-6-controllers' },
          { nameFa: 'DS-22', nameEn: 'DS-22', slug: 'ds-22-controllers' },
        ],
      },
      {
        nameFa: 'Call Stations',
        nameEn: 'Call Stations',
        slug: 'call-stations',
        children: [
          { nameFa: 'DS-6', nameEn: 'DS-6', slug: 'ds-6-call-stations' },
          { nameFa: 'DS-22', nameEn: 'DS-22', slug: 'ds-22-call-stations' },
        ],
      },
      { nameFa: 'Speakers & Siren', nameEn: 'Speakers & Siren', slug: 'speakers-siren' },
      { nameFa: 'Software', nameEn: 'Software', slug: 'paga-software' },
    ],
  },
  // Radio
  {
    nameFa: 'Radio',
    nameEn: 'Radio',
    slug: 'radio',
    children: [
      {
        nameFa: 'DMR',
        nameEn: 'DMR',
        slug: 'dmr',
        children: [
          { nameFa: 'MOTOTRBO', nameEn: 'MOTOTRBO', slug: 'mototrbo' },
        ],
      },
      { nameFa: 'TETRA', nameEn: 'TETRA', slug: 'tetra' },
      {
        nameFa: 'Project 25 Radios',
        nameEn: 'Project 25 Radios',
        slug: 'project-25-radios',
        children: [
          { nameFa: 'Mobile Radios', nameEn: 'Mobile Radios', slug: 'mobile-radios' },
          { nameFa: 'Portable Radios', nameEn: 'Portable Radios', slug: 'portable-radios' },
          { nameFa: 'Discontinued', nameEn: 'Discontinued', slug: 'discontinued' },
        ],
      },
    ],
  },
  // Microwave
  {
    nameFa: 'Microwave',
    nameEn: 'Microwave',
    slug: 'microwave',
    children: [
      { nameFa: 'Hardware Products', nameEn: 'Hardware Products', slug: 'hardware-products' },
      { nameFa: 'Software Products', nameEn: 'Software Products', slug: 'software-products' },
    ],
  },
  // Wireless
  {
    nameFa: 'Wireless',
    nameEn: 'Wireless',
    slug: 'wireless',
    children: [
      { nameFa: 'Point to Point', nameEn: 'Point to Point', slug: 'point-to-point' },
      { nameFa: 'Point to Multipoint', nameEn: 'Point to Multipoint', slug: 'point-to-multipoint' },
      { nameFa: 'WLAN', nameEn: 'WLAN', slug: 'wlan' },
      { nameFa: 'MESH', nameEn: 'MESH', slug: 'mesh' },
    ],
  },
  // CCTV
  {
    nameFa: 'CCTV',
    nameEn: 'CCTV',
    slug: 'cctv',
    children: [
      { nameFa: 'Access Control', nameEn: 'Access Control', slug: 'access-control' },
      { nameFa: 'Security Cameras', nameEn: 'Security Cameras', slug: 'security-cameras' },
    ],
  },
  // Radar
  {
    nameFa: 'Radar Surveillance System',
    nameEn: 'Radar Surveillance System',
    slug: 'radar-surveillance-system',
  },
]

interface CategoryInput {
  nameFa: string
  nameEn: string
  slug: string
  children?: CategoryInput[]
}

async function createCategory(
  category: CategoryInput,
  parentId: string | null = null,
  order: number = 0
): Promise<void> {
  // Check if category already exists
  const existing = await prisma.category.findUnique({
    where: { slug: category.slug },
  })

  let categoryId: string

  if (existing) {
    // Update existing category
    const updated = await prisma.category.update({
      where: { slug: category.slug },
      data: {
        nameFa: category.nameFa,
        nameEn: category.nameEn,
        parentId,
        order,
      },
    })
    categoryId = updated.id
    console.log(`✓ Updated: ${category.nameEn}`)
  } else {
    // Create new category
    const created = await prisma.category.create({
      data: {
        nameFa: category.nameFa,
        nameEn: category.nameEn,
        slug: category.slug,
        parentId,
        order,
      },
    })
    categoryId = created.id
    console.log(`+ Created: ${category.nameEn}`)
  }

  // Create children if any
  if (category.children) {
    for (let i = 0; i < category.children.length; i++) {
      await createCategory(category.children[i], categoryId, i)
    }
  }
}

async function main() {
  console.log('🚀 Starting category import...\n')

  for (let i = 0; i < categories.length; i++) {
    await createCategory(categories[i], null, i)
  }

  console.log('\n✅ Category import completed!')

  // Show summary
  const count = await prisma.category.count()
  console.log(`📊 Total categories in database: ${count}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
