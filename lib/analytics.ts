declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Pre-defined events for the website
export const trackProductView = (productName: string) => {
  event({
    action: 'view_item',
    category: 'Product',
    label: productName,
  })
}

export const trackCatalogDownload = (catalogName: string) => {
  event({
    action: 'download',
    category: 'Catalog',
    label: catalogName,
  })
}

export const trackInquirySubmit = (productName?: string) => {
  event({
    action: 'submit_inquiry',
    category: 'Lead',
    label: productName || 'General',
  })
}

export const trackContactFormSubmit = () => {
  event({
    action: 'submit_contact',
    category: 'Lead',
    label: 'Contact Form',
  })
}

export const trackWhatsAppClick = (source: string) => {
  event({
    action: 'whatsapp_click',
    category: 'Contact',
    label: source,
  })
}

export const trackPhoneClick = () => {
  event({
    action: 'phone_click',
    category: 'Contact',
    label: 'Phone Call',
  })
}

export const trackSearch = (query: string) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
  })
}

export const trackCompareAdd = (productName: string) => {
  event({
    action: 'add_to_compare',
    category: 'Compare',
    label: productName,
  })
}
