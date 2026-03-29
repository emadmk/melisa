import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Analyzing 47 uncategorized Arabic-slug products...\n')

  const uncategorized = await prisma.product.findMany({
    where: { categoryId: null, status: 'PUBLISHED' },
    select: { id: true, slug: true, titleFa: true, titleEn: true, titleAr: true, brandId: true },
  })

  console.log(`Found ${uncategorized.length} uncategorized products\n`)

  // These are Arabic duplicate entries - the real products already exist
  // with English slugs and have categories assigned.
  // These Arabic-slug copies should be set to DRAFT (hidden) so they
  // don't show up as duplicates.

  let archived = 0
  let skipped = 0

  for (const product of uncategorized) {
    const slug = product.slug
    // Check if slug is URL-encoded Arabic (starts with %d)
    const isArabicSlug = slug.startsWith('%d') || /^[\u0600-\u06FF]/.test(decodeURIComponent(slug).charAt(0))

    if (isArabicSlug) {
      // Set to DRAFT so it doesn't appear in listings
      await prisma.product.update({
        where: { id: product.id },
        data: { status: 'DRAFT' },
      })
      const decoded = decodeURIComponent(slug).substring(0, 50)
      console.log(`📦 Archived (DRAFT): ${decoded}`)
      archived++
    } else {
      const decoded = decodeURIComponent(slug).substring(0, 50)
      console.log(`⏭️  Kept: ${decoded}`)
      skipped++
    }
  }

  console.log(`\n✅ Archived ${archived} Arabic duplicate products (set to DRAFT)`)
  console.log(`⏭️  Kept ${skipped} products`)

  const stillUncategorized = await prisma.product.count({ where: { categoryId: null, status: 'PUBLISHED' } })
  console.log(`\n📊 Still uncategorized & published: ${stillUncategorized} products`)

  const totalPublished = await prisma.product.count({ where: { status: 'PUBLISHED' } })
  console.log(`📊 Total published products: ${totalPublished}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
