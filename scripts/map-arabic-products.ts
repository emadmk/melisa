import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Mapping remaining 47 Arabic uncategorized products...\n')

  const getCatId = async (slug: string) => {
    const cat = await prisma.category.findUnique({ where: { slug } })
    return cat?.id || null
  }

  const pagaId = await getCatId('paga')
  const accessControlId = await getCatId('access-control')
  const softwareProductsId = await getCatId('software-products')
  const wlanId = await getCatId('wlan')
  const ptpId = await getCatId('point-to-point')

  // Mapping rules: decoded Arabic slug keywords → category
  const rules: { keywords: string[]; categoryId: string | null }[] = [
    // Access Control (لوحة التحكم، قارئ، مصعد، دخول، وصول، توسعة)
    { keywords: ['%d9%84%d9%88%d8%ad%d8%a9-%d8%a7%d9%84%d8%aa%d8%ad%d9%83%d9%85-%d9%81%d9%8a-%d8%a7%d9%84%d9%88%d8%b5%d9%88%d9%84'], categoryId: accessControlId }, // لوحة-التحكم-في-الوصول
    { keywords: ['%d9%84%d9%88%d8%ad%d8%a9-%d8%aa%d8%ad%d9%83%d9%85-%d9%81%d9%8a-%d8%a7%d9%84%d8%af%d8%ae%d9%88%d9%84'], categoryId: accessControlId }, // لوحة-تحكم-في-الدخول
    { keywords: ['%d9%84%d9%88%d8%ad%d8%a9-%d8%aa%d9%88%d8%b3%d8%b9%d8%a9'], categoryId: accessControlId }, // لوحة-توسعة
    { keywords: ['%d9%84%d9%88%d8%ad%d8%a9-%d8%a7%d9%84%d9%85%d8%b5%d8%b9%d8%af'], categoryId: accessControlId }, // لوحة-المصعد
    { keywords: ['%d9%82%d8%a7%d8%b1%d8%a6'], categoryId: accessControlId }, // قارئ (reader)
    { keywords: ['%d8%aa%d8%ad%d9%83%d9%85-%d8%a8%d8%a7%d8%a8'], categoryId: accessControlId }, // تحكم-باب (door controller)
    { keywords: ['mullion'], categoryId: accessControlId },

    // PAGA / Intercom (محطة اتصال داخلي، انتركم، سماعة، غطاء، عمود، ميكروفون، مفتاح قدم، توسيع الإسكان)
    { keywords: ['%d9%85%d8%ad%d8%b7%d8%a9-%d8%a7%d8%aa%d8%b5%d8%a7%d9%84-%d8%af%d8%a7%d8%ae%d9%84%d9%8a'], categoryId: pagaId }, // محطة-اتصال-داخلي
    { keywords: ['%d9%85%d8%ad%d8%b7%d8%a9-%d8%a7%d9%84%d8%a7%d8%aa%d8%b5%d8%a7%d9%84-%d8%a7%d9%84%d8%af%d8%a7%d8%ae%d9%84%d9%8a'], categoryId: pagaId }, // محطة-الاتصال-الداخلي
    { keywords: ['%d9%85%d8%ad%d8%b7%d8%a9-%d8%a7%d9%86%d8%aa%d8%b1%d9%83%d9%85'], categoryId: pagaId }, // محطة-انتركم
    { keywords: ['%d8%b3%d9%85%d8%a7%d8%b9%d8%a9'], categoryId: pagaId }, // سماعة (headset/handset)
    { keywords: ['%d8%ba%d8%b7%d8%a7%d8%a1'], categoryId: pagaId }, // غطاء (hood/cover)
    { keywords: ['%d8%b9%d9%85%d9%88%d8%af-%d8%aa%d8%b1%d9%83%d9%8a%d8%a8'], categoryId: pagaId }, // عمود-تركيب (mounting post)
    { keywords: ['%d9%85%d9%8a%d9%83%d8%b1%d9%88%d9%81%d9%88%d9%86'], categoryId: pagaId }, // ميكروفون
    { keywords: ['%d9%85%d9%81%d8%aa%d8%a7%d8%ad-%d9%82%d8%af%d9%85'], categoryId: pagaId }, // مفتاح-قدم (foot switch)
    { keywords: ['%d8%a7%d9%84%d8%aa%d8%a8%d8%af%d9%8a%d9%84-%d8%a7%d9%84%d9%82%d8%af%d9%85'], categoryId: pagaId }, // التبديل-القدم
    { keywords: ['%d8%aa%d9%88%d8%b3%d9%8a%d8%b9-%d8%a7%d9%84%d8%a5%d8%b3%d9%83%d8%a7%d9%86'], categoryId: pagaId }, // توسيع-الإسكان (expansion housing)

    // Software (إدارة واي فاي، وحدة موازنة، وحدة تجاوز، ضيافة)
    { keywords: ['%d8%a5%d8%af%d8%a7%d8%b1%d8%a9-%d9%88%d8%a7%d9%8a-%d9%81%d8%a7%d9%8a'], categoryId: softwareProductsId }, // إدارة-واي-فاي
    { keywords: ['%d9%88%d8%ad%d8%af%d8%a9-%d9%85%d9%88%d8%a7%d8%b2%d9%86%d8%a9'], categoryId: softwareProductsId }, // وحدة-موازنة (load balancing)
    { keywords: ['%d9%88%d8%ad%d8%af%d8%a9-%d8%aa%d8%ac%d8%a7%d9%88%d8%b2'], categoryId: softwareProductsId }, // وحدة-تجاوز (failover)
    { keywords: ['%d8%b6%d9%8a%d8%a7%d9%81%d8%a9'], categoryId: softwareProductsId }, // ضيافة (hospitality)
    { keywords: ['%d8%ae%d9%8a%d8%a7%d8%b1-%d9%88%d8%ad%d8%af%d8%a9-%d8%a8%d8%b1%d8%a7%d9%85%d8%ac'], categoryId: softwareProductsId }, // خيار-وحدة-برامج

    // WLAN (نقاط الوصول، مفاتيح lan)
    { keywords: ['%d9%86%d9%82%d8%a7%d8%b7-%d8%a7%d9%84%d9%88%d8%b5%d9%88%d9%84'], categoryId: wlanId }, // نقاط-الوصول
    { keywords: ['%d9%86%d9%82%d8%b7%d8%a9-%d9%88%d8%b5%d9%88%d9%84'], categoryId: wlanId }, // نقطة-وصول
    { keywords: ['%d9%85%d9%81%d8%a7%d8%aa%d9%8a%d8%ad-lan'], categoryId: wlanId }, // مفاتيح-lan

    // PtP (cnwave)
    { keywords: ['cnwave'], categoryId: ptpId },

    // Promotional - skip
    { keywords: ['%d8%aa%d8%ae%d9%81%d9%8a%d8%b6%d8%a7%d8%aa'], categoryId: null }, // تخفيضات (sale/discount)
  ]

  const uncategorized = await prisma.product.findMany({
    where: { categoryId: null, status: 'PUBLISHED' },
  })

  let mapped = 0
  for (const product of uncategorized) {
    const slug = product.slug.toLowerCase()
    let targetCatId: string | null = null

    for (const rule of rules) {
      if (rule.keywords.some(kw => slug.includes(kw.toLowerCase()))) {
        targetCatId = rule.categoryId
        break
      }
    }

    if (targetCatId) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: targetCatId },
      })
      mapped++
      const decoded = decodeURIComponent(product.slug).substring(0, 50)
      console.log(`✅ ${decoded}...`)
    } else {
      const decoded = decodeURIComponent(product.slug).substring(0, 50)
      console.log(`⏭️  Skipped: ${decoded}...`)
    }
  }

  console.log(`\n✅ Mapped ${mapped} out of ${uncategorized.length} products`)

  const stillUncategorized = await prisma.product.count({ where: { categoryId: null, status: 'PUBLISHED' } })
  console.log(`⚠️  Still uncategorized: ${stillUncategorized} products`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
