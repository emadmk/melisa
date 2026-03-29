import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get all categories
  const categories = await prisma.category.findMany({
    include: {
      parent: { select: { nameFa: true, nameEn: true, slug: true } },
      _count: { select: { products: true, productsMulti: true } },
    },
    orderBy: { order: 'asc' },
  })

  console.log('=== ALL CATEGORIES ===')
  console.log('ID | Slug | Name (EN) | Name (FA) | Parent | Products Count')
  console.log('---'.repeat(30))
  for (const cat of categories) {
    const parentName = cat.parent ? `${cat.parent.nameEn || cat.parent.nameFa} (${cat.parent.slug})` : '—'
    const productCount = cat._count.products + cat._count.productsMulti
    console.log(`${cat.id} | ${cat.slug} | ${cat.nameEn || '—'} | ${cat.nameFa} | Parent: ${parentName} | ${productCount} products`)
  }

  // Get all products with category and brand
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: { select: { nameFa: true, nameEn: true, slug: true } },
      brand: { select: { name: true, slug: true } },
      categories: { select: { nameFa: true, nameEn: true, slug: true } },
    },
    orderBy: [{ category: { nameFa: 'asc' } }, { titleFa: 'asc' }],
  })

  console.log('\n\n=== ALL PRODUCTS (PUBLISHED) ===')
  console.log(`Total: ${products.length} products`)
  console.log('---'.repeat(30))

  // Group by category
  const grouped = new Map<string, typeof products>()
  for (const p of products) {
    const catName = p.category ? `${p.category.nameEn || p.category.nameFa} (${p.category.slug})` : 'NO CATEGORY'
    if (!grouped.has(catName)) grouped.set(catName, [])
    grouped.get(catName)!.push(p)
  }

  for (const [catName, prods] of grouped) {
    console.log(`\n📁 ${catName} — ${prods.length} products`)
    for (const p of prods) {
      const brandName = p.brand ? p.brand.name : 'No Brand'
      const multiCats = p.categories.length > 0 ? ` | Also in: ${p.categories.map(c => c.slug).join(', ')}` : ''
      console.log(`   - ${p.titleEn || p.titleFa} | Brand: ${brandName} | Slug: ${p.slug}${multiCats}`)
    }
  }

  // Get all brands with product counts
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })

  console.log('\n\n=== ALL BRANDS ===')
  for (const b of brands) {
    console.log(`${b.name} (${b.slug}) — ${b._count.products} products`)
  }

  // Show new menu categories mapping
  console.log('\n\n=== NEW MENU CATEGORIES (what we need to map to) ===')
  const menuCategories = [
    { name: 'PAGA & Industrial Intercom', slug: 'paga', children: ['public-address-general-alarm', 'industrial-intercom-systems', 'speakers-siren', 'paga-software-functions'] },
    { name: 'Industrial CCTV & Surveillance', slug: 'cctv', children: ['fixed-ptz-cameras', 'explosion-proof-cameras', 'video-management-system'] },
    { name: 'Perimeter Security & Radar', slug: 'radar-surveillance-system', children: ['perimeter-radars', 'intrusion-detection-systems', 'radar-cctv-integration'] },
    { name: 'Radio Communication', slug: 'radio', children: ['tetra', 'dmr', 'dispatching-solutions'] },
    { name: 'Microwave Communication', slug: 'microwave', children: ['ptp-microwave-links', 'ptmp'] },
    { name: 'Optical Transport & Fiber', slug: 'otn-fiber', children: ['otn-systems', 'sdh-legacy-integration', 'fiber-optic-infrastructure', 'optical-transmission-solutions'] },
  ]

  for (const mc of menuCategories) {
    const dbCat = categories.find(c => c.slug === mc.slug)
    console.log(`\n${mc.name} (${mc.slug}) → DB: ${dbCat ? `EXISTS (${dbCat.id})` : '❌ NOT FOUND'}`)
    for (const child of mc.children) {
      const dbChild = categories.find(c => c.slug === child)
      console.log(`   └─ ${child} → ${dbChild ? `EXISTS (${dbChild.id})` : '❌ NOT FOUND'}`)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
