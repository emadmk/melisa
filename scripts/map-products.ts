import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Starting category restructuring and product mapping...\n')

  // ============================================================
  // STEP 1: Get existing parent categories
  // ============================================================
  const paga = await prisma.category.findUnique({ where: { slug: 'paga' } })
  const cctv = await prisma.category.findUnique({ where: { slug: 'cctv' } })
  const radar = await prisma.category.findUnique({ where: { slug: 'radar-surveillance-system' } })
  const radio = await prisma.category.findUnique({ where: { slug: 'radio' } })
  const microwave = await prisma.category.findUnique({ where: { slug: 'microwave' } })

  if (!paga || !cctv || !radar || !radio || !microwave) {
    console.error('❌ Missing parent categories!')
    return
  }

  // ============================================================
  // STEP 2: Create missing subcategories + OTN parent
  // ============================================================
  const categoriesToCreate = [
    // PAGA subcategories
    { slug: 'public-address-general-alarm', nameFa: 'Public Address & General Alarm', nameEn: 'Public Address & General Alarm', nameAr: 'النداء العام والإنذار العام', parentId: paga.id, order: 1 },
    { slug: 'industrial-intercom-systems', nameFa: 'Industrial Intercom Systems', nameEn: 'Industrial Intercom Systems', nameAr: 'أنظمة الاتصال الداخلي الصناعي', parentId: paga.id, order: 2 },
    { slug: 'paga-software-functions', nameFa: 'Software & Functions', nameEn: 'Software & Functions', nameAr: 'البرمجيات والوظائف', parentId: paga.id, order: 4 },

    // CCTV subcategories
    { slug: 'fixed-ptz-cameras', nameFa: 'Fixed & PTZ Cameras', nameEn: 'Fixed & PTZ Cameras', nameAr: 'كاميرات ثابتة ومتحركة', parentId: cctv.id, order: 1 },
    { slug: 'explosion-proof-cameras', nameFa: 'Explosion Proof Cameras', nameEn: 'Explosion Proof Cameras', nameAr: 'كاميرات مقاومة للانفجار', parentId: cctv.id, order: 2 },
    { slug: 'video-management-system', nameFa: 'Video Management System', nameEn: 'Video Management System', nameAr: 'نظام إدارة الفيديو', parentId: cctv.id, order: 3 },

    // Radar subcategories
    { slug: 'perimeter-radars', nameFa: 'Perimeter Radars 360°', nameEn: 'Perimeter Radars 360°', nameAr: 'رادارات المحيط 360°', parentId: radar.id, order: 1 },
    { slug: 'intrusion-detection-systems', nameFa: 'Intrusion Detection Systems', nameEn: 'Intrusion Detection Systems', nameAr: 'أنظمة كشف التسلل', parentId: radar.id, order: 2 },
    { slug: 'radar-cctv-integration', nameFa: 'Radar & CCTV Integration', nameEn: 'Radar & CCTV Integration', nameAr: 'تكامل الرادار والمراقبة', parentId: radar.id, order: 3 },

    // Radio subcategories
    { slug: 'dispatching-solutions', nameFa: 'Dispatching Solutions', nameEn: 'Dispatching Solutions', nameAr: 'حلول الإرسال', parentId: radio.id, order: 3 },

    // Microwave subcategories
    { slug: 'ptp-microwave-links', nameFa: 'PtP Microwave Links', nameEn: 'PtP Microwave Links', nameAr: 'وصلات ميكروويف نقطة لنقطة', parentId: microwave.id, order: 1 },
    { slug: 'ptmp', nameFa: 'PtMP Solutions', nameEn: 'PtMP Solutions', nameAr: 'حلول نقطة لمتعدد النقاط', parentId: microwave.id, order: 2 },
  ]

  // Create OTN parent first
  let otnFiber = await prisma.category.findUnique({ where: { slug: 'otn-fiber' } })
  if (!otnFiber) {
    otnFiber = await prisma.category.create({
      data: { slug: 'otn-fiber', nameFa: 'Optical Transport & Fiber Network', nameEn: 'Optical Transport & Fiber Network', nameAr: 'النقل البصري وشبكات الألياف', order: 6 },
    })
    console.log('✅ Created parent: otn-fiber')
  }

  // OTN subcategories
  categoriesToCreate.push(
    { slug: 'otn-systems', nameFa: 'OTN Systems', nameEn: 'OTN Systems', nameAr: 'أنظمة OTN', parentId: otnFiber.id, order: 1 },
    { slug: 'sdh-legacy-integration', nameFa: 'SDH/Legacy Integration', nameEn: 'SDH/Legacy Integration', nameAr: 'تكامل SDH/القديم', parentId: otnFiber.id, order: 2 },
    { slug: 'fiber-optic-infrastructure', nameFa: 'Fiber Optic Infrastructure', nameEn: 'Fiber Optic Infrastructure', nameAr: 'البنية التحتية للألياف الضوئية', parentId: otnFiber.id, order: 3 },
    { slug: 'optical-transmission-solutions', nameFa: 'Optical Transmission Solutions', nameEn: 'Optical Transmission Solutions', nameAr: 'حلول النقل البصري', parentId: otnFiber.id, order: 4 },
  )

  for (const cat of categoriesToCreate) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (!existing) {
      await prisma.category.create({ data: cat })
      console.log(`✅ Created subcategory: ${cat.slug}`)
    } else {
      // Update parent if needed
      if (existing.parentId !== cat.parentId) {
        await prisma.category.update({
          where: { slug: cat.slug },
          data: { parentId: cat.parentId, nameEn: cat.nameEn, nameAr: cat.nameAr },
        })
        console.log(`🔄 Updated parent for: ${cat.slug}`)
      } else {
        console.log(`⏭️  Already exists: ${cat.slug}`)
      }
    }
  }

  // Update speakers-siren parent to paga
  await prisma.category.update({
    where: { slug: 'speakers-siren' },
    data: { parentId: paga.id, order: 3, nameEn: 'Speakers & Siren', nameAr: 'مكبرات الصوت والصفارات' },
  })
  console.log('🔄 Updated speakers-siren parent to paga')

  // ============================================================
  // STEP 3: Remap existing subcategories under correct parents
  // ============================================================

  // Move security-cameras and access-control under cctv
  const secCam = await prisma.category.findUnique({ where: { slug: 'security-cameras' } })
  if (secCam) {
    await prisma.category.update({ where: { slug: 'security-cameras' }, data: { parentId: cctv.id } })
    console.log('🔄 Moved security-cameras under cctv')
  }
  const accCtrl = await prisma.category.findUnique({ where: { slug: 'access-control' } })
  if (accCtrl) {
    await prisma.category.update({ where: { slug: 'access-control' }, data: { parentId: cctv.id } })
    console.log('🔄 Moved access-control under cctv')
  }

  // Move MOTOTRBO under dmr (it's already there, just confirm)
  const mototrbo = await prisma.category.findUnique({ where: { slug: 'mototrbo' } })
  const dmr = await prisma.category.findUnique({ where: { slug: 'dmr' } })
  if (mototrbo && dmr) {
    await prisma.category.update({ where: { slug: 'mototrbo' }, data: { parentId: dmr.id } })
    await prisma.category.update({ where: { slug: 'dmr' }, data: { parentId: radio.id } })
    console.log('🔄 Confirmed DMR/MOTOTRBO under radio')
  }

  // Move TETRA under radio
  const tetra = await prisma.category.findUnique({ where: { slug: 'tetra' } })
  if (tetra) {
    await prisma.category.update({ where: { slug: 'tetra' }, data: { parentId: radio.id } })
    console.log('🔄 Confirmed TETRA under radio')
  }

  // Move hardware-products and software-products under microwave
  const hwProducts = await prisma.category.findUnique({ where: { slug: 'hardware-products' } })
  if (hwProducts) {
    await prisma.category.update({ where: { slug: 'hardware-products' }, data: { parentId: microwave.id } })
    console.log('🔄 Moved hardware-products under microwave')
  }
  const swProducts = await prisma.category.findUnique({ where: { slug: 'software-products' } })
  if (swProducts) {
    await prisma.category.update({ where: { slug: 'software-products' }, data: { parentId: microwave.id } })
    console.log('🔄 Moved software-products under microwave')
  }

  // Move wireless subcategories under microwave
  for (const slug of ['point-to-point', 'point-to-multipoint', 'wlan', 'mesh']) {
    const cat = await prisma.category.findUnique({ where: { slug } })
    if (cat) {
      await prisma.category.update({ where: { slug }, data: { parentId: microwave.id } })
      console.log(`🔄 Moved ${slug} under microwave`)
    }
  }

  // Move explosion proof under cctv
  const expProof = await prisma.category.findUnique({ where: { slug: 'explosion proof' } })
  if (expProof) {
    await prisma.category.update({ where: { id: expProof.id }, data: { parentId: cctv.id, slug: 'explosion-proof', nameEn: 'Explosion Proof', nameAr: 'مقاوم للانفجار' } })
    console.log('🔄 Moved explosion proof under cctv')
  }

  // Move Outdoor under cctv
  const outdoor = await prisma.category.findUnique({ where: { slug: 'Outdoor' } })
  if (outdoor) {
    await prisma.category.update({ where: { id: outdoor.id }, data: { parentId: cctv.id, slug: 'outdoor', nameEn: 'Outdoor', nameAr: 'خارجية' } })
    console.log('🔄 Moved Outdoor under cctv')
  }

  // Move paga-software under paga as paga-software-functions
  const pagaSw = await prisma.category.findUnique({ where: { slug: 'paga-software' } })
  const pagaSwNew = await prisma.category.findUnique({ where: { slug: 'paga-software-functions' } })
  if (pagaSw && pagaSwNew) {
    // Move any products from old to new
    await prisma.product.updateMany({
      where: { categoryId: pagaSw.id },
      data: { categoryId: pagaSwNew.id },
    })
    console.log('🔄 Moved paga-software products to paga-software-functions')
  }

  // ============================================================
  // STEP 4: Map uncategorized products by brand
  // ============================================================
  console.log('\n📦 Mapping uncategorized products by brand...\n')

  const uncategorized = await prisma.product.findMany({
    where: { categoryId: null, status: 'PUBLISHED' },
    include: { brand: { select: { slug: true, name: true } } },
  })

  console.log(`Found ${uncategorized.length} uncategorized products`)

  // Get target category IDs
  const getCatId = async (slug: string) => {
    const cat = await prisma.category.findUnique({ where: { slug } })
    return cat?.id || null
  }

  const pagaId = paga.id
  const fixedPtzId = await getCatId('fixed-ptz-cameras')
  const accessControlId = await getCatId('access-control')
  const secCamId = await getCatId('security-cameras')
  const radarId = radar.id
  const ptpId = await getCatId('point-to-point')
  const ptmpId = await getCatId('point-to-multipoint')
  const wlanId = await getCatId('wlan')
  const meshId = await getCatId('mesh')

  let mapped = 0
  for (const product of uncategorized) {
    const brandSlug = product.brand?.slug
    const name = (product.titleEn || product.titleFa || '').toLowerCase()
    let targetCatId: string | null = null

    if (brandSlug === 'neumann') {
      targetCatId = pagaId
    } else if (brandSlug === 'avigilon') {
      // Cameras vs access control
      if (name.includes('access') || name.includes('reader') || name.includes('controller') || name.includes('panel') || name.includes('elevator') || name.includes('intercom reader')) {
        targetCatId = accessControlId
      } else {
        targetCatId = secCamId || fixedPtzId
      }
    } else if (brandSlug === 'motorola') {
      const tetraCat = await getCatId('tetra')
      const dmrCat = await getCatId('mototrbo')
      if (name.includes('tetra')) {
        targetCatId = tetraCat
      } else {
        targetCatId = dmrCat
      }
    } else if (brandSlug === 'siae-microelettronica') {
      const hwCatId = await getCatId('hardware-products')
      const swCatId = await getCatId('software-products')
      if (name.includes('software') || name.includes('network-management') || name.includes('sdn')) {
        targetCatId = swCatId
      } else {
        targetCatId = hwCatId
      }
    } else if (brandSlug === 'cambium-networks') {
      if (name.includes('ptp') || name.includes('point-to-point') || name.includes('flex4g') || name.includes('etherhaul') || name.includes('etherflex') || name.includes('flexport') || name.includes('ptp-')) {
        targetCatId = ptpId
      } else if (name.includes('pmp') || name.includes('epmp') || name.includes('multihaul') || name.includes('cnmedusa')) {
        targetCatId = ptmpId
      } else if (name.includes('cnpilot') || name.includes('wlan') || name.includes('indoor') || name.includes('outdoor') || name.includes('access-point') || name.includes('lan-switch') || name.includes('eg-')) {
        targetCatId = wlanId
      } else if (name.includes('breadcrumb') || name.includes('hotport') || name.includes('hotpoint') || name.includes('mesh') || name.includes('bccommander')) {
        targetCatId = meshId
      } else if (name.includes('cnwave') || name.includes('cnranger') || name.includes('navigator')) {
        targetCatId = ptpId
      } else {
        targetCatId = wlanId // default for Cambium
      }
    } else if (brandSlug === 'navtech-radar') {
      targetCatId = radarId
    } else if (brandSlug === 'pelco') {
      targetCatId = secCamId || fixedPtzId
    } else {
      // No brand - try to guess from product name
      if (name.includes('camera') || name.includes('كاميرا') || name.includes('dome') || name.includes('bullet') || name.includes('ptz') || name.includes('h5a') || name.includes('h6') || name.includes('h4') || name.includes('h5-pro') || name.includes('lpc') || name.includes('halo') || name.includes('ava')) {
        targetCatId = secCamId || fixedPtzId
      } else if (name.includes('reader') || name.includes('قارئ') || name.includes('access') || name.includes('وصول') || name.includes('لوحة-التحكم') || name.includes('تحكم-باب') || name.includes('controller') || name.includes('مصعد') || name.includes('expansion-board') || name.includes('توسعة')) {
        targetCatId = accessControlId
      } else if (name.includes('intercom') || name.includes('انترکم') || name.includes('اتصال-داخلي') || name.includes('محطة') || name.includes('station') || name.includes('handset') || name.includes('سماعة') || name.includes('headset') || name.includes('hood') || name.includes('غطاء') || name.includes('microphone') || name.includes('ميكروفون') || name.includes('foot-switch') || name.includes('مفتاح-قدم') || name.includes('mounting-post') || name.includes('عمود') || name.includes('housing') || name.includes('إسكان')) {
        targetCatId = pagaId
      } else if (name.includes('radar') || name.includes('hdr')) {
        targetCatId = radarId
      } else if (name.includes('ptp') || name.includes('موصل') || name.includes('ptp-')) {
        targetCatId = ptpId
      } else if (name.includes('epmp') || name.includes('نقطة-وصول')) {
        targetCatId = ptmpId
      } else if (name.includes('wlan') || name.includes('cnpilot') || name.includes('wifi') || name.includes('واي-فاي') || name.includes('نقاط-الوصول') || name.includes('lan') || name.includes('مفاتيح')) {
        targetCatId = wlanId
      } else if (name.includes('load-balanc') || name.includes('موازنة') || name.includes('hotspot') || name.includes('هوت-سبوت') || name.includes('failover') || name.includes('تجاوز') || name.includes('hospitality') || name.includes('ضيافة')) {
        const swCatId2 = await getCatId('software-products')
        targetCatId = swCatId2
      } else if (name.includes('sale') || name.includes('discount') || name.includes('تخفيض')) {
        // promotional products - skip or put in general
        targetCatId = null
      }
    }

    if (targetCatId) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: targetCatId },
      })
      mapped++
    }
  }

  console.log(`\n✅ Mapped ${mapped} out of ${uncategorized.length} uncategorized products`)

  // ============================================================
  // STEP 5: Map radar products to perimeter-radars
  // ============================================================
  const perimeterRadarsId = await getCatId('perimeter-radars')
  if (perimeterRadarsId) {
    // Move products currently in radar-surveillance-system to perimeter-radars
    const radarProducts = await prisma.product.updateMany({
      where: { categoryId: radar.id },
      data: { categoryId: perimeterRadarsId },
    })
    console.log(`🔄 Moved ${radarProducts.count} radar products to perimeter-radars`)
  }

  // ============================================================
  // STEP 6: Update brands for radar products
  // ============================================================
  const navtechBrand = await prisma.brand.findUnique({ where: { slug: 'navtech-radar' } })
  if (navtechBrand && perimeterRadarsId) {
    // Set brand for radar products that have no brand
    await prisma.product.updateMany({
      where: {
        categoryId: perimeterRadarsId,
        brandId: null,
      },
      data: { brandId: navtechBrand.id },
    })
    console.log('🔄 Set Navtech Radar brand for unbranded radar products')
  }

  // ============================================================
  // FINAL: Print summary
  // ============================================================
  console.log('\n📊 FINAL SUMMARY:')
  const allCats = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { products: true } },
          children: { include: { _count: { select: { products: true } } } },
        },
      },
      _count: { select: { products: true } },
    },
    orderBy: { order: 'asc' },
  })

  for (const cat of allCats) {
    const totalProducts = cat._count.products + cat.children.reduce((sum, c) => sum + c._count.products + c.children.reduce((s, cc) => s + cc._count.products, 0), 0)
    console.log(`\n📁 ${cat.nameEn || cat.nameFa} (${cat.slug}) — ${totalProducts} total products`)
    for (const child of cat.children) {
      const childTotal = child._count.products + child.children.reduce((s, cc) => s + cc._count.products, 0)
      console.log(`   ├── ${child.nameEn || child.nameFa} (${child.slug}) — ${childTotal} products`)
      for (const grandchild of child.children) {
        console.log(`   │   └── ${grandchild.nameEn || grandchild.nameFa} (${grandchild.slug}) — ${grandchild._count.products} products`)
      }
    }
  }

  const stillUncategorized = await prisma.product.count({ where: { categoryId: null, status: 'PUBLISHED' } })
  console.log(`\n⚠️  Still uncategorized: ${stillUncategorized} products`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
