import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import PartnersSection from '@/components/home/PartnersSection'
import WhoWeAreSection from '@/components/home/WhoWeAreSection'
import CustomersSection from '@/components/home/CustomersSection'
import LatestPosts from '@/components/home/LatestPosts'

export const metadata: Metadata = {
  title: 'ميليسا | حلول الاتصالات والأمن',
  description:
    'ميليسا هي شركة اتصالات متخصصة في مشاريع الاتصالات والراديو وكاميرات المراقبة وأنظمة النداء. نقدم حلول اتصالات عالية الجودة وآمنة في دبي، الإمارات.',
  keywords: [
    'معدات الاتصالات',
    'كاميرات المراقبة',
    'أنظمة الأمن',
    'موتورولا',
    'أفيجيلون',
    'كامبيوم نتوركس',
    'الاتصالات اللاسلكية',
    'أنظمة النداء',
    'دبي',
    'الإمارات',
  ],
}

export default function ArabicHomePage() {
  return (
    <>
      <HeroSection />
      <PartnersSection />
      <WhoWeAreSection />
      <CustomersSection />
      <LatestPosts />
    </>
  )
}
