# کرمان هاتف ارتباط

سایت رسمی شرکت کرمان هاتف ارتباط - تامین‌کننده تجهیزات مخابراتی و امنیتی

## فناوری‌ها

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Analytics:** Google Analytics 4

## پیش‌نیازها

- Node.js 18+
- PostgreSQL 14+
- npm یا yarn

## نصب و راه‌اندازی

```bash
# Clone project
git clone <repo-url>
cd hatef-website

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## اسکریپت‌ها

```bash
npm run dev           # سرور توسعه
npm run build         # بیلد پروداکشن
npm run start         # اجرای پروداکشن
npm run lint          # بررسی کد
npm run migrate:wp    # مایگریشن از وردپرس
npm run backup        # بکاپ دیتابیس و فایل‌ها
npm run backup:list   # لیست بکاپ‌ها
npm run optimize:images # بهینه‌سازی تصاویر
```

## ساختار پروژه

```
hatef-website/
├── app/                    # Next.js App Router
│   ├── (site)/            # صفحات عمومی
│   ├── admin/             # پنل ادمین
│   └── api/               # API Routes
├── components/            # React components
│   ├── ui/               # کامپوننت‌های پایه
│   ├── layout/           # Header, Footer
│   ├── products/         # کامپوننت‌های محصول
│   ├── forms/            # فرم‌ها
│   ├── common/           # مشترک
│   └── admin/            # ادمین
├── lib/                   # توابع کمکی
├── prisma/               # Schema دیتابیس
├── scripts/              # اسکریپت‌ها
├── public/               # فایل‌های استاتیک
└── types/                # TypeScript types
```

## Deploy روی Ubuntu

### نیازمندی‌های سرور

- Ubuntu 22.04+
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2
- Certbot (SSL)

### مراحل Deploy

```bash
# Clone
git clone <repo> /var/www/hatef/app
cd /var/www/hatef/app

# Install
npm ci

# Setup environment
cp .env.example .env
nano .env  # تنظیم مقادیر

# Database
npx prisma migrate deploy

# Migration از وردپرس (یکبار)
npm run migrate:wp

# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/hatef
sudo ln -s /etc/nginx/sites-available/hatef /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL with Certbot
sudo certbot --nginx -d hatefertebat.ir -d www.hatefertebat.ir
```

### Cron Jobs

```bash
# بکاپ روزانه (ساعت 3 صبح)
0 3 * * * cd /var/www/hatef/app && npm run backup

# بهینه‌سازی تصاویر (هفته‌ای)
0 4 * * 0 cd /var/www/hatef/app && npm run optimize:images
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Site URL |
| `NEXTAUTH_SECRET` | Random secret key |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

## سئو

- Sitemap خودکار: `/sitemap.xml`
- Robots.txt: `/robots.txt`
- Schema.org: Organization, LocalBusiness, Product, Article, FAQPage
- Open Graph & Twitter Cards

## پشتیبانی

- تلفن: 021-24871000
- ایمیل: info@hatefertebat.ir
