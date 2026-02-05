'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/lib/i18n/LocaleContext'

const contentEn = {
  title: 'WHO WE ARE ?',
  subtitle: 'We strive to provide high-quality and secure products that meet the needs of our customers.',
  intro: 'Our company offers a wide range of products in the field of telecommunications, radio, CCTV, and paging. We strive to provide high-quality and secure products that meet the needs of our customers.',
  radio: {
    label: 'Radio:',
    text: 'We provide radio communication products, including handheld radios, mobile radios, and base station radios. Our products are designed for a variety of industries, including public safety, transportation, and hospitality.',
  },
  cctv: {
    label: 'CCTV:',
    text: 'We offer a range of CCTV products, including cameras, video recorders, and monitoring software. Our products are designed to provide high-quality surveillance and enhance security in a variety of settings.',
  },
  paging: {
    label: 'Paging:',
    text: 'We offer paging products, including pagers and paging systems. Our products are designed to provide reliable communication and messaging systems in a variety of industries, including healthcare and hospitality.',
  },
}

const contentAr = {
  title: 'من نحن؟',
  subtitle: 'نسعى لتقديم منتجات عالية الجودة وآمنة تلبي احتياجات عملائنا.',
  intro: 'تقدم شركتنا مجموعة واسعة من المنتجات في مجال الاتصالات والراديو وكاميرات المراقبة والنداء. نحن نسعى لتقديم منتجات عالية الجودة وآمنة تلبي احتياجات عملائنا.',
  radio: {
    label: 'الراديو:',
    text: 'نقدم منتجات الاتصالات اللاسلكية، بما في ذلك أجهزة الراديو المحمولة باليد والراديو المتنقل وأجهزة الراديو الثابتة. منتجاتنا مصممة لمختلف الصناعات، بما في ذلك السلامة العامة والنقل والضيافة.',
  },
  cctv: {
    label: 'كاميرات المراقبة:',
    text: 'نقدم مجموعة من منتجات كاميرات المراقبة، بما في ذلك الكاميرات ومسجلات الفيديو وبرامج المراقبة. منتجاتنا مصممة لتوفير مراقبة عالية الجودة وتعزيز الأمن في مختلف البيئات.',
  },
  paging: {
    label: 'أنظمة النداء:',
    text: 'نقدم منتجات النداء، بما في ذلك أجهزة النداء وأنظمة النداء. منتجاتنا مصممة لتوفير أنظمة اتصال ومراسلة موثوقة في مختلف الصناعات، بما في ذلك الرعاية الصحية والضيافة.',
  },
}

export default function WhoWeAreSection() {
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const content = isArabic ? contentAr : contentEn

  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-white/90 font-medium mb-4">
            {content.subtitle}
          </p>
          <div className="max-w-4xl mx-auto space-y-4 text-white/80">
            <p>
              {content.intro}
            </p>
            <p>
              <strong className="text-white">{content.radio.label}</strong> {content.radio.text}
            </p>
            <p>
              <strong className="text-white">{content.cctv.label}</strong> {content.cctv.text}
            </p>
            <p>
              <strong className="text-white">{content.paging.label}</strong> {content.paging.text}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
