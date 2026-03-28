import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const brandUpdates = [
  {
    slug: 'avigilon',
    name: 'Avigilon',
    nameAr: 'أفيجيلون',
    website: 'https://www.avigilon.com',
    logo: '/images/avigilon-logo.webp',
    order: 1,
    description: `Avigilon, a Motorola Solutions company, is a global leader in advanced security solutions headquartered in Vancouver, Canada. Since its acquisition by Motorola Solutions in 2018, Avigilon has been at the forefront of AI-powered video surveillance, access control, and cloud-based security platforms. Their product portfolio includes high-resolution cameras ranging from 1MP to 7K (30MP), video analytics with self-learning AI, the Avigilon Alta cloud-native platform, and the Avigilon Unity on-premise solution. Trusted by enterprises, governments, and critical infrastructure operators worldwide, Avigilon integrates video, access control, intrusion detection, and smart sensors into a unified security ecosystem that enables faster detection, verification, and response to threats.`,
    descriptionAr: `أفيجيلون، إحدى شركات موتورولا سوليوشنز، هي شركة رائدة عالمياً في حلول الأمن المتقدمة ومقرها في فانكوفر، كندا. منذ استحواذ موتورولا سوليوشنز عليها في عام 2018، تتصدر أفيجيلون مجال المراقبة بالفيديو المدعومة بالذكاء الاصطناعي والتحكم في الوصول ومنصات الأمن السحابية. تشمل محفظة منتجاتها كاميرات عالية الدقة تصل إلى 7K، وتحليلات فيديو ذاتية التعلم بالذكاء الاصطناعي، ومنصة أفيجيلون ألتا السحابية، وحل أفيجيلون يونيتي المحلي.`,
  },
  {
    slug: 'cambium-networks',
    name: 'Cambium Networks',
    nameAr: 'كامبيوم نتوركس',
    website: 'https://www.cambiumnetworks.com',
    logo: '/images/combium-network-logo.webp',
    order: 2,
    description: `Cambium Networks is a leading global provider of wireless broadband networking infrastructure solutions, originally spun out of Motorola in 2011. Headquartered in the United States and publicly traded on NASDAQ, the company designs and manufactures enterprise-grade wireless solutions including point-to-point backhaul, point-to-multipoint access, Wi-Fi 6/6E access points, intelligent switches, and cloud-managed networking platforms. With over 10 million radios shipped worldwide, Cambium Networks serves ISPs, enterprises, industrial operators, and government agencies across more than 150 countries.`,
    descriptionAr: `كامبيوم نتوركس هي شركة رائدة عالمياً في حلول البنية التحتية لشبكات النطاق العريض اللاسلكية، انبثقت من موتورولا في عام 2011. مقرها الولايات المتحدة ومدرجة في بورصة ناسداك، تصمم وتصنع حلولاً لاسلكية على مستوى المؤسسات تشمل الربط من نقطة لنقطة، والوصول من نقطة لنقاط متعددة، ونقاط وصول واي فاي 6/6E، ومفاتيح ذكية، ومنصات إدارة الشبكات السحابية.`,
  },
  {
    slug: 'motorola',
    name: 'Motorola Solutions',
    nameAr: 'موتورولا سوليوشنز',
    website: 'https://www.motorolasolutions.com',
    logo: '/images/motorola-logo.webp',
    order: 3,
    description: `Motorola Solutions is the global leader in mission-critical communications and enterprise security, traded on NYSE under MSI. With a heritage spanning over 90 years, the company provides two-way radio systems, broadband push-to-talk solutions, command center technologies, and integrated video security platforms. Their iconic MOTOTRBO digital radio series delivers crystal-clear audio and data capabilities for commercial enterprises, while the APX series serves public safety with rugged, secure communication devices trusted by first responders worldwide.`,
    descriptionAr: `موتورولا سوليوشنز هي الشركة الرائدة عالمياً في الاتصالات الحيوية وأمن المؤسسات، مدرجة في بورصة نيويورك تحت رمز MSI. مع تراث يمتد لأكثر من 90 عاماً، توفر الشركة أنظمة الراديو ثنائي الاتجاه، وحلول الاتصال عبر النطاق العريض، وتقنيات مراكز القيادة، ومنصات أمن الفيديو المتكاملة.`,
  },
  {
    slug: 'siae-microelettronica',
    name: 'SIAE Microelettronica',
    nameAr: 'سياي ميكروإلكترونيكا',
    website: 'https://www.siaemic.com',
    logo: '/images/sm-logo.webp',
    order: 4,
    description: `SIAE Microelettronica is an Italian multinational corporation and one of the world's leading manufacturers of microwave radio and wireless network solutions, founded in 1952 in Milan. With over 70 years of innovation, the company designs and produces point-to-point microwave radio systems operating from 4GHz to 80GHz, E-band radios, multiplexers, cell site gateways, and optical transport solutions through its subsidiary SM Optics. Their equipment enables reliable communication for millions of people across more than 80 countries.`,
    descriptionAr: `سياي ميكروإلكترونيكا هي شركة إيطالية متعددة الجنسيات ومن أبرز الشركات المصنعة في العالم لحلول الراديو الميكروي والشبكات اللاسلكية، تأسست عام 1952 في ميلانو. مع أكثر من 70 عاماً من الابتكار، تصمم وتنتج الشركة أنظمة راديو ميكروي من نقطة لنقطة تعمل من 4 جيجاهرتز إلى 80 جيجاهرتز.`,
  },
  {
    slug: 'neumann',
    name: 'NEUMANN Elektronik',
    nameAr: 'نويمان إلكترونيك',
    website: 'https://neumann-elektronik.com',
    logo: '/images/neumann-logo-white.svg',
    order: 5,
    description: `NEUMANN Elektronik GmbH, based in Mülheim an der Ruhr, Germany, has been a pioneer in public address and intercom systems since 1948, when it delivered its first complete PA systems to the railway sector. Today, the company is recognized as a global leader in Intercom, Public Address, and General Alarm (PAGA) systems for the chemical industry, oil & gas, heavy industry, energy & utilities, and transport sectors. Their flagship DS-22 IP communication system offers unlimited modular architecture, optimum speech quality at 12kHz, full redundancy, and seamless integration with telephony, radio, video, and fire alarm systems.`,
    descriptionAr: `نويمان إلكترونيك المحدودة، مقرها في مولهايم أن دير رور، ألمانيا، رائدة في أنظمة الإذاعة العامة والاتصال الداخلي منذ عام 1948، حين قدمت أول أنظمة إذاعة كاملة لقطاع السكك الحديدية. اليوم، تُعرف الشركة كقائد عالمي في أنظمة الاتصال الداخلي والإذاعة العامة والإنذار العام (PAGA) للصناعة الكيميائية والنفط والغاز والصناعة الثقيلة والطاقة والمرافق وقطاعات النقل.`,
  },
  {
    slug: 'navtech-radar',
    name: 'Navtech Radar',
    nameAr: 'نافتك رادار',
    website: 'https://navtechradar.com',
    logo: '/images/navtech-radar-logo.svg',
    order: 6,
    description: `Navtech Radar is a world-leading innovator, award-winning designer and manufacturer of commercially deployed radar solutions. Based in Wantage, Oxfordshire, UK, the company's ground-breaking technology is utilized by clients across industry sectors including security surveillance, industrial automation, and intelligent transportation systems. Renowned for investing heavily in innovation, research and development, Navtech has earned an unrivalled reputation for products that are high-performance, robust, and extremely reliable. Their radar systems deliver precise, real-time 360° perimeter protection in all weather and lighting conditions, making them ideal for airports, ports, critical infrastructure, and high-security facilities worldwide.`,
    descriptionAr: `نافتك رادار هي شركة رائدة عالمياً ومبتكرة حائزة على جوائز في تصميم وتصنيع حلول الرادار المنتشرة تجارياً. مقرها في وانتاج، أوكسفوردشاير، المملكة المتحدة، تُستخدم تقنيتها المبتكرة من قبل العملاء عبر قطاعات صناعية تشمل المراقبة الأمنية والأتمتة الصناعية وأنظمة النقل الذكية. تقدم أنظمة الرادار الخاصة بها حماية محيطية دقيقة بزاوية 360 درجة في الوقت الفعلي في جميع الظروف الجوية والإضاءة.`,
  },
  {
    slug: 'pelco',
    name: 'Pelco',
    nameAr: 'بيلكو',
    website: 'https://www.pelco.com',
    logo: '/images/pelco-logo.svg',
    order: 7,
    description: `Pelco, a Motorola Solutions company, is a trusted security provider since 1957 with an expansive portfolio of open-platform cameras, sensors and specialty security devices. Headquartered in Fresno, California, Pelco joined Motorola Solutions in 2020, continuing its legacy with a shared commitment to innovation and creating safer spaces. With a re-engineered portfolio of intelligent rugged security cameras and AI-powered smart sensors, Pelco's devices are notably deployed to help protect landmarks including Buckingham Palace, the Sydney Opera House, and the Statue of Liberty. Built on an open platform, Pelco devices plug into any system for scalable, future-proof security with more than 1 million installations worldwide.`,
    descriptionAr: `بيلكو، إحدى شركات موتورولا سوليوشنز، مزود أمني موثوق منذ عام 1957 مع محفظة واسعة من الكاميرات وأجهزة الاستشعار وأجهزة الأمن المتخصصة ذات المنصة المفتوحة. مقرها في فريسنو، كاليفورنيا، انضمت بيلكو إلى موتورولا سوليوشنز في عام 2020. مع محفظة معاد هندستها من كاميرات الأمن الذكية وأجهزة الاستشعار المدعومة بالذكاء الاصطناعي، تُنشر أجهزة بيلكو لحماية معالم بارزة مثل قصر باكنغهام ودار أوبرا سيدني وتمثال الحرية.`,
  },
]

async function main() {
  for (const brand of brandUpdates) {
    const existing = await prisma.brand.findUnique({ where: { slug: brand.slug } })
    if (existing) {
      await prisma.brand.update({
        where: { slug: brand.slug },
        data: {
          name: brand.name,
          nameAr: brand.nameAr,
          website: brand.website,
          description: brand.description,
          descriptionAr: brand.descriptionAr,
          logo: brand.logo,
          order: brand.order,
        },
      })
      console.log(`✓ Updated: ${brand.name}`)
    } else {
      await prisma.brand.create({
        data: {
          name: brand.name,
          nameAr: brand.nameAr,
          slug: brand.slug,
          website: brand.website,
          description: brand.description,
          descriptionAr: brand.descriptionAr,
          logo: brand.logo,
          order: brand.order,
          featured: true,
        },
      })
      console.log(`✓ Created: ${brand.name}`)
    }
  }
  console.log('\nDone! All 7 brands updated.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
