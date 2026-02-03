# WordPress Migration Script

این اسکریپت برای انتقال داده‌ها از وردپرس به سیستم جدید Next.js طراحی شده است.

## پیش‌نیازها

1. نصب پکیج mysql2:
```bash
npm install mysql2
```

2. تنظیم متغیرهای محیطی در فایل `.env`:
```env
# WordPress Database
WP_DB_HOST=localhost
WP_DB_USER=root
WP_DB_PASSWORD=your_password
WP_DB_NAME=wordpress_db
WP_TABLE_PREFIX=wp_

# WordPress Media Path (optional)
WP_MEDIA_PATH=/var/www/html/wp-content/uploads

# Prisma Database (already set)
DATABASE_URL="postgresql://user:password@localhost:5432/hatef_db"
```

## اجرای اسکریپت

```bash
# اطمینان از تولید Prisma Client
npx prisma generate

# اجرای مایگریشن دیتابیس
npx prisma db push

# اجرای اسکریپت انتقال
npx ts-node scripts/migrate-wordpress.ts
```

## آنچه منتقل می‌شود

- **دسته‌بندی‌ها (Categories)**: دسته‌بندی محصولات WooCommerce
- **محصولات (Products)**: تمام محصولات WooCommerce با تصاویر و مشخصات
- **مقالات (Posts)**: مقالات وبلاگ با تصاویر شاخص
- **صفحات (Pages)**: محتوای صفحات استاتیک (ذخیره در فایل JSON)
- **تنظیمات (Settings)**: تنظیمات پایه سایت
- **فایل‌های رسانه (Media)**: تصاویر محصولات و مقالات

## نکات مهم

1. **قبل از اجرا**:
   - از دیتابیس وردپرس بکاپ بگیرید
   - اسکریپت را ابتدا روی محیط تست اجرا کنید

2. **پس از اجرا**:
   - فایل `migrated-pages.json` را بررسی کنید
   - تصاویر منتقل شده را در پوشه `public/images` چک کنید
   - داده‌های منتقل شده را در پنل ادمین بررسی کنید

3. **عیب‌یابی**:
   - در صورت خطای اتصال به دیتابیس، تنظیمات `.env` را بررسی کنید
   - در صورت خطای Prisma، دستور `npx prisma generate` را مجدداً اجرا کنید
