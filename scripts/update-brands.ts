import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const brandUpdates = [
  {
    slug: 'avigilon',
    name: 'Avigilon',
    nameAr: 'أفيجيلون',
    website: 'https://www.avigilon.com',
    description: `Avigilon, a Motorola Solutions company, is a global leader in advanced security solutions headquartered in Vancouver, Canada. Since its acquisition by Motorola Solutions in 2018, Avigilon has been at the forefront of AI-powered video surveillance, access control, and cloud-based security platforms. Their product portfolio includes high-resolution cameras ranging from 1MP to 7K (30MP), video analytics with self-learning AI, the Avigilon Alta cloud-native platform, and the Avigilon Unity on-premise solution. Trusted by enterprises, governments, and critical infrastructure operators worldwide, Avigilon integrates video, access control, intrusion detection, and smart sensors into a unified security ecosystem that enables faster detection, verification, and response to threats.`,
    descriptionAr: `أفيجيلون، إحدى شركات موتورولا سوليوشنز، هي شركة رائدة عالمياً في حلول الأمن المتقدمة ومقرها في فانكوفر، كندا. منذ استحواذ موتورولا سوليوشنز عليها في عام 2018، تتصدر أفيجيلون مجال المراقبة بالفيديو المدعومة بالذكاء الاصطناعي والتحكم في الوصول ومنصات الأمن السحابية. تشمل محفظة منتجاتها كاميرات عالية الدقة تصل إلى 7K، وتحليلات فيديو ذاتية التعلم بالذكاء الاصطناعي، ومنصة أفيجيلون ألتا السحابية، وحل أفيجيلون يونيتي المحلي. تحظى بثقة المؤسسات والحكومات ومشغلي البنية التحتية الحيوية حول العالم، وتدمج أفيجيلون الفيديو والتحكم في الوصول وكشف التسلل وأجهزة الاستشعار الذكية في منظومة أمنية موحدة.`,
  },
  {
    slug: 'cambium-networks',
    name: 'Cambium Networks',
    nameAr: 'كامبيوم نتوركس',
    website: 'https://www.cambiumnetworks.com',
    description: `Cambium Networks is a leading global provider of wireless broadband networking infrastructure solutions, originally spun out of Motorola in 2011. Headquartered in the United States and publicly traded on NASDAQ, the company designs and manufactures enterprise-grade wireless solutions including point-to-point backhaul, point-to-multipoint access, Wi-Fi 6/6E access points, intelligent switches, and cloud-managed networking platforms. With over 10 million radios shipped worldwide, Cambium Networks serves ISPs, enterprises, industrial operators, and government agencies across more than 150 countries. Their cnReach platform provides robust industrial-grade connectivity for oil & gas, utilities, mining, and transportation sectors, while their enterprise Wi-Fi solutions deliver reliable coverage for campuses, municipalities, and warehouses.`,
    descriptionAr: `كامبيوم نتوركس هي شركة رائدة عالمياً في حلول البنية التحتية لشبكات النطاق العريض اللاسلكية، انبثقت من موتورولا في عام 2011. مقرها الولايات المتحدة ومدرجة في بورصة ناسداك، تصمم وتصنع حلولاً لاسلكية على مستوى المؤسسات تشمل الربط من نقطة لنقطة، والوصول من نقطة لنقاط متعددة، ونقاط وصول واي فاي 6/6E، ومفاتيح ذكية، ومنصات إدارة الشبكات السحابية. مع شحن أكثر من 10 ملايين جهاز راديو حول العالم، تخدم كامبيوم نتوركس مزودي خدمات الإنترنت والمؤسسات والمشغلين الصناعيين والوكالات الحكومية في أكثر من 150 دولة. توفر منصتها cnReach اتصالاً صناعياً متيناً لقطاعات النفط والغاز والمرافق والتعدين والنقل.`,
  },
  {
    slug: 'motorola',
    name: 'Motorola Solutions',
    nameAr: 'موتورولا سوليوشنز',
    website: 'https://www.motorolasolutions.com',
    description: `Motorola Solutions is the global leader in mission-critical communications and enterprise security, traded on NYSE under MSI. With a heritage spanning over 90 years, the company provides two-way radio systems, broadband push-to-talk solutions, command center technologies, and integrated video security platforms. Their iconic MOTOTRBO digital radio series delivers crystal-clear audio and data capabilities for commercial enterprises, while the APX series serves public safety with rugged, secure communication devices trusted by first responders worldwide. Motorola Solutions connects over 100,000 public safety and enterprise customers in more than 100 countries, offering end-to-end solutions from handheld radios and mobile devices to repeater infrastructure, fleet management, and AI-powered analytics.`,
    descriptionAr: `موتورولا سوليوشنز هي الشركة الرائدة عالمياً في الاتصالات الحيوية وأمن المؤسسات، مدرجة في بورصة نيويورك تحت رمز MSI. مع تراث يمتد لأكثر من 90 عاماً، توفر الشركة أنظمة الراديو ثنائي الاتجاه، وحلول الاتصال عبر النطاق العريض، وتقنيات مراكز القيادة، ومنصات أمن الفيديو المتكاملة. تقدم سلسلة MOTOTRBO الرقمية جودة صوت فائقة وقدرات بيانات للمؤسسات التجارية، بينما تخدم سلسلة APX قطاع السلامة العامة بأجهزة اتصال متينة وآمنة يعتمد عليها المستجيبون الأوائل في جميع أنحاء العالم. تربط موتورولا سوليوشنز أكثر من 100,000 عميل في أكثر من 100 دولة.`,
  },
  {
    slug: 'siae-microelettronica',
    name: 'SIAE Microelettronica',
    nameAr: 'سياي ميكروإلكترونيكا',
    website: 'https://www.siaemic.com',
    description: `SIAE Microelettronica is an Italian multinational corporation and one of the world's leading manufacturers of microwave radio and wireless network solutions, founded in 1952 in Milan. With over 70 years of innovation, the company designs and produces point-to-point microwave radio systems operating from 4GHz to 80GHz, E-band radios, multiplexers, cell site gateways, and optical transport solutions through its subsidiary SM Optics. Their equipment enables reliable communication for millions of people across more than 80 countries, providing mobile backhaul for 2G/3G/4G/5G networks, high-speed LAN interconnections, and critical infrastructure links. SIAE Microelettronica maintains 26 regional offices globally and has been a technological partner for 5G deployments, collaborating with major operators like Vodafone on 10 Gbit/s microwave links.`,
    descriptionAr: `سياي ميكروإلكترونيكا هي شركة إيطالية متعددة الجنسيات ومن أبرز الشركات المصنعة في العالم لحلول الراديو الميكروي والشبكات اللاسلكية، تأسست عام 1952 في ميلانو. مع أكثر من 70 عاماً من الابتكار، تصمم وتنتج الشركة أنظمة راديو ميكروي من نقطة لنقطة تعمل من 4 جيجاهرتز إلى 80 جيجاهرتز، وأجهزة E-band، ومضاعفات، وبوابات مواقع خلوية، وحلول النقل البصري. تمكّن معداتها ملايين الأشخاص من التواصل في أكثر من 80 دولة، مما يوفر الربط الخلفي للشبكات المحمولة 2G/3G/4G/5G، والربط عالي السرعة بين الشبكات المحلية، وروابط البنية التحتية الحيوية. تمتلك الشركة 26 مكتباً إقليمياً عالمياً وهي شريك تقني لنشر شبكات 5G.`,
  },
  {
    slug: 'neumann',
    name: 'NEUMANN Elektronik',
    nameAr: 'نويمان إلكترونيك',
    website: 'https://neumann-elektronik.com',
    description: `NEUMANN Elektronik GmbH, based in Mülheim an der Ruhr, Germany, has been a pioneer in public address and intercom systems since 1948, when it delivered its first complete PA systems to the railway sector. Today, the company is recognized as a global leader in Intercom, Public Address, and General Alarm (PAGA) systems for the chemical industry, oil & gas, heavy industry, energy & utilities, and transport sectors. Their flagship DS-22 IP communication system offers unlimited modular architecture, optimum speech quality at 12kHz, full redundancy, and seamless integration with telephony, radio, video, and fire alarm systems. Certified to IEC 62368 and EN 54-16 standards, NEUMANN's solutions are deployed in refineries, petrochemical plants, offshore platforms, and critical infrastructure facilities worldwide, providing standards for a safer world.`,
    descriptionAr: `نويمان إلكترونيك المحدودة، مقرها في مولهايم أن دير رور، ألمانيا، رائدة في أنظمة الإذاعة العامة والاتصال الداخلي منذ عام 1948، حين قدمت أول أنظمة إذاعة كاملة لقطاع السكك الحديدية. اليوم، تُعرف الشركة كقائد عالمي في أنظمة الاتصال الداخلي والإذاعة العامة والإنذار العام (PAGA) للصناعة الكيميائية والنفط والغاز والصناعة الثقيلة والطاقة والمرافق وقطاعات النقل. يقدم نظام الاتصال DS-22 IP الرائد بنية معمارية معيارية غير محدودة وجودة صوت مثالية عند 12 كيلوهرتز وتكرار كامل وتكامل سلس مع الهاتف والراديو والفيديو وأنظمة إنذار الحريق. حاصلة على شهادات IEC 62368 وEN 54-16، تُنشر حلول نويمان في المصافي والمصانع البتروكيماوية والمنصات البحرية والمنشآت الحيوية حول العالم.`,
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
        },
      })
      console.log(`Updated brand: ${brand.name}`)
    } else {
      await prisma.brand.create({
        data: {
          name: brand.name,
          nameAr: brand.nameAr,
          slug: brand.slug,
          website: brand.website,
          description: brand.description,
          descriptionAr: brand.descriptionAr,
          featured: true,
        },
      })
      console.log(`Created brand: ${brand.name}`)
    }
  }
  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
