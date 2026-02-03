import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hatefertebat.ir' },
    update: {},
    create: {
      email: 'admin@hatefertebat.ir',
      name: 'مدیر سایت',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create default settings
  const defaultSettings = [
    { key: 'site_name', value: 'کرمان هاتف ارتباط' },
    { key: 'site_description', value: 'تامین کننده تجهیزات مخابراتی و امنیتی' },
    { key: 'phone', value: '021-24871000' },
    { key: 'whatsapp', value: '09123456789' },
    { key: 'email', value: 'info@hatefertebat.ir' },
    { key: 'address', value: 'تهران، رسالت، مجیدیه شمالی، خ اردکانی، کوچه مهتابی پور، پلاک ۲۸' },
    { key: 'working_hours', value: 'شنبه تا چهارشنبه: ۹ تا ۱۸ | پنجشنبه: ۹ تا ۱۳' },
  ]

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('Default settings created')

  // Create sample categories
  const categories = [
    { nameFa: 'دوربین مداربسته', nameEn: 'CCTV', slug: 'cctv' },
    { nameFa: 'کنترل دسترسی', nameEn: 'Access Control', slug: 'access-control' },
    { nameFa: 'سیستم پیجینگ', nameEn: 'Paging System', slug: 'paging' },
    { nameFa: 'تجهیزات شبکه', nameEn: 'Network Equipment', slug: 'network' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Sample categories created')

  // Create sample brands
  const brands = [
    { name: 'Motorola', slug: 'motorola', featured: true },
    { name: 'Avigilon', slug: 'avigilon', featured: true },
    { name: 'Cambium Networks', slug: 'cambium', featured: true },
    { name: 'Industronic', slug: 'industronic', featured: true },
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    })
  }

  console.log('Sample brands created')

  // Create sample services
  const services = [
    {
      titleFa: 'راه اندازی',
      titleEn: 'Setup',
      slug: 'setup',
      shortDesc: 'راه اندازی کامل سیستم‌های امنیتی و مخابراتی',
      status: 'PUBLISHED' as const,
      order: 1,
    },
    {
      titleFa: 'تامین تجهیزات',
      titleEn: 'Supply',
      slug: 'supply',
      shortDesc: 'تامین انواع تجهیزات امنیتی و مخابراتی',
      status: 'PUBLISHED' as const,
      order: 2,
    },
    {
      titleFa: 'نصب',
      titleEn: 'Installation',
      slug: 'installation',
      shortDesc: 'نصب حرفه‌ای توسط تیم متخصص',
      status: 'PUBLISHED' as const,
      order: 3,
    },
    {
      titleFa: 'مهندسی',
      titleEn: 'Engineering',
      slug: 'engineering',
      shortDesc: 'خدمات مهندسی و مشاوره فنی',
      status: 'PUBLISHED' as const,
      order: 4,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  console.log('Sample services created')

  // Create sample FAQs
  const faqs = [
    {
      question: 'چگونه می‌توانم محصولات را سفارش دهم؟',
      answer: 'شما می‌توانید از طریق فرم درخواست قیمت در صفحه محصول، یا تماس تلفنی با ما سفارش خود را ثبت کنید.',
      status: 'PUBLISHED' as const,
      order: 1,
    },
    {
      question: 'آیا گارانتی محصولات را دارید؟',
      answer: 'بله، تمامی محصولات دارای گارانتی اصالت و خدمات پس از فروش هستند.',
      status: 'PUBLISHED' as const,
      order: 2,
    },
    {
      question: 'هزینه نصب چقدر است؟',
      answer: 'هزینه نصب بسته به نوع و تعداد تجهیزات متفاوت است. برای اطلاع از هزینه دقیق با ما تماس بگیرید.',
      status: 'PUBLISHED' as const,
      order: 3,
    },
  ]

  for (const faq of faqs) {
    await prisma.faq.create({
      data: faq,
    })
  }

  console.log('Sample FAQs created')
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
