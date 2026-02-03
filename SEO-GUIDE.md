# راهنمای سئو - کرمان هاتف ارتباط
## SEO Guide for Kerman Hatef Ertebat Website

---

## 📋 چک‌لیست سئو

### ۱. عناوین و توضیحات متا

#### عنوان متا (Meta Title)
- ✅ طول ایده‌آل: **۳۰-۶۰ کاراکتر**
- ✅ کلمه کلیدی اصلی در ابتدا
- ✅ نام برند در انتها
- ✅ فرمت: `کلمه کلیدی | توضیح کوتاه | کرمان هاتف ارتباط`

**مثال:**
```
خرید دوربین مداربسته Avigilon | کیفیت 4K | کرمان هاتف ارتباط
```

#### توضیحات متا (Meta Description)
- ✅ طول ایده‌آل: **۱۲۰-۱۶۰ کاراکتر**
- ✅ شامل کلمه کلیدی
- ✅ فراخوان به عمل (CTA)
- ✅ منحصربفرد برای هر صفحه

**مثال:**
```
خرید دوربین مداربسته Avigilon با کیفیت 4K و تشخیص چهره. نمایندگی رسمی با گارانتی اصلی. مشاوره رایگان: ۰۲۱-۲۴۸۷۱۰۰۰
```

---

### ۲. ساختار URL

#### اصول URL سئو-پسند:
- ✅ کوتاه و خوانا
- ✅ فقط حروف انگلیسی کوچک، اعداد و خط تیره
- ✅ بدون کاراکتر خاص و فاصله
- ✅ شامل کلمه کلیدی

**مثال‌های صحیح:**
```
/products/avigilon-4k-camera
/services/installation
/blog/choosing-right-cctv
```

**مثال‌های غلط:**
```
/products/دوربین_ایویجیلون
/products?id=123
/products/product%20name
```

---

### ۳. محتوای صفحات

#### ساختار عناوین (Headings):
```
H1: عنوان اصلی صفحه (فقط یکی)
  H2: بخش‌های اصلی
    H3: زیربخش‌ها
      H4: جزئیات
```

#### نکات محتوا:
- ✅ حداقل **۳۰۰ کلمه** برای صفحات مهم
- ✅ پاراگراف‌های کوتاه (۲-۳ جمله)
- ✅ استفاده از لیست‌ها
- ✅ تراکم کلمه کلیدی: **۰.۵٪ - ۲.۵٪**
- ✅ لینک‌های داخلی به صفحات مرتبط

---

### ۴. تصاویر

#### بهینه‌سازی تصاویر:
- ✅ **متن جایگزین (Alt):** توصیفی و شامل کلمه کلیدی
- ✅ **نام فایل:** توصیفی با خط تیره
- ✅ **فرمت:** WebP یا JPEG بهینه
- ✅ **ابعاد:** متناسب با نمایش
- ✅ **فشرده‌سازی:** کاهش حجم بدون افت کیفیت

**مثال Alt Text:**
```
alt="دوربین مداربسته Avigilon مدل H5 با کیفیت 4K"
```

---

### ۵. Schema.org (داده‌های ساختاریافته)

#### Organization:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "کرمان هاتف ارتباط",
  "url": "https://hatefertebat.ir",
  "logo": "https://hatefertebat.ir/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+98-21-24871000",
    "contactType": "sales"
  }
}
```

#### Product:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "دوربین مداربسته Avigilon",
  "description": "...",
  "brand": { "@type": "Brand", "name": "Avigilon" },
  "image": "https://hatefertebat.ir/images/product.jpg"
}
```

#### Article:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "راهنمای انتخاب دوربین مداربسته",
  "author": { "@type": "Organization", "name": "کرمان هاتف ارتباط" },
  "datePublished": "2024-01-15"
}
```

#### FAQPage:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "سوال؟",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "پاسخ"
    }
  }]
}
```

---

### ۶. لینک‌سازی داخلی

#### اصول لینک‌سازی:
- ✅ لینک به صفحات مرتبط
- ✅ استفاده از anchor text توصیفی
- ✅ Breadcrumb در همه صفحات
- ✅ منوی فوتر با لینک‌های مهم

**مثال Anchor Text خوب:**
```html
<a href="/products/cctv">دوربین‌های مداربسته</a>
```

**مثال Anchor Text بد:**
```html
<a href="/products/cctv">کلیک کنید</a>
```

---

### ۷. Core Web Vitals

#### معیارها:
| معیار | خوب | نیاز به بهبود | ضعیف |
|-------|-----|---------------|------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

#### راهکارها:
- ✅ استفاده از `next/image` برای تصاویر
- ✅ Lazy loading برای محتوای زیر fold
- ✅ فونت‌های بهینه با `font-display: swap`
- ✅ کش مرورگر
- ✅ فشرده‌سازی Gzip/Brotli

---

### ۸. موبایل

#### الزامات:
- ✅ ریسپانسیو کامل
- ✅ فونت حداقل ۱۶px
- ✅ دکمه‌ها حداقل ۴۸×۴۸ پیکسل
- ✅ فاصله کافی بین عناصر کلیک‌شدنی
- ✅ تست با Google Mobile-Friendly Test

---

### ۹. سرعت سایت

#### ابزارهای تست:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

#### هدف:
- ✅ امتیاز PageSpeed: بالای ۹۰
- ✅ زمان بارگذاری: زیر ۳ ثانیه

---

### ۱۰. Sitemap و Robots.txt

#### Sitemap.xml:
- ✅ شامل همه صفحات مهم
- ✅ آپدیت خودکار
- ✅ ثبت در Google Search Console

#### Robots.txt:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://hatefertebat.ir/sitemap.xml
```

---

## 🔧 ابزارها

### Google Search Console
- بررسی ایندکس شدن صفحات
- مشاهده کلمات کلیدی
- رفع خطاهای crawl

### Google Analytics 4
- آنالیز ترافیک
- رفتار کاربران
- نرخ تبدیل

### ابزارهای داخلی
- **SEO Helper:** در پنل ادمین، هنگام ویرایش محتوا
- **Sitemap:** خودکار در `/sitemap.xml`

---

## 📊 KPIها

| معیار | هدف ماهانه |
|-------|------------|
| بازدید ارگانیک | +۱۰٪ رشد |
| صفحات ایندکس شده | ۱۰۰٪ |
| Core Web Vitals | سبز |
| موقعیت میانگین | بهبود ۵ رتبه |
| نرخ کلیک (CTR) | بالای ۳٪ |

---

## 📝 چک‌لیست قبل از انتشار

- [ ] عنوان متا ۳۰-۶۰ کاراکتر
- [ ] توضیحات متا ۱۲۰-۱۶۰ کاراکتر
- [ ] URL سئو-پسند
- [ ] H1 منحصربفرد
- [ ] تصاویر با Alt
- [ ] لینک‌های داخلی
- [ ] Schema.org مناسب
- [ ] تست موبایل
- [ ] تست سرعت

---

برای سوالات بیشتر با تیم فنی تماس بگیرید.
