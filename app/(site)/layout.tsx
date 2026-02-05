import { Header, Footer } from '@/components/layout'
import { WhatsAppButton, BackToTop } from '@/components/common'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import { getDictionary } from '@/lib/i18n/dictionaries'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dictionary = await getDictionary('en')

  return (
    <LocaleProvider locale="en" dictionary={dictionary}>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </LocaleProvider>
  )
}
