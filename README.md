# کاوشگر ریک و مورتی

وب‌اپ Nuxt 4 / Vue 3 با SSR، جست‌وجو، صفحه‌بندی و صفحهٔ جزئیات شخصیت‌ها.

نیازمند Node.js نسخهٔ `22.22.3` یا `24.15.0` به بالا است.

## اجرا

```bash
npm install
npm run dev
```

برای تغییر آدرس API، فایل `.env.example` را به `.env` کپی کنید و مقدار `NUXT_PUBLIC_API_BASE` را تنظیم کنید. اگر این متغیر تنظیم نشود، برنامه از آدرس پیش‌فرض Rick and Morty API استفاده می‌کند.

برنامه در `http://localhost:3000` در دسترس است. برای بررسی نسخهٔ تولید:

```bash
npm run build
npm run preview
```

## بررسی کیفیت

```bash
npm test
npm run lint
npm run typecheck
```

پاسخ‌های API در حافظهٔ سرور تا یک ساعت کش می‌شوند. تصاویر کاراکترها مستقیماً از Rick and Morty API بارگذاری می‌شوند و در صورت خطا تصویر جایگزین نمایش داده می‌شود.

## استقرار روی Cloudflare Pages

در تنظیمات پروژهٔ Pages، شاخهٔ تولید را `main`، دستور ساخت را `npm run build:cloudflare` و پوشهٔ خروجی را `dist` قرار دهید. مسیر ریشهٔ پروژه باید ریشهٔ همین مخزن باشد. اگر آدرس API را تغییر می‌دهید، `NUXT_PUBLIC_API_BASE` را در متغیرهای محیطی Pages تنظیم کنید.

## فناوری‌ها

Nuxt 4، Vue 3، TypeScript و Tailwind CSS 4. داده‌ها از [Rick and Morty API](https://rickandmortyapi.com/documentation) دریافت می‌شوند و کلید API لازم نیست.

## مسیرها

- `/`: فهرست شخصیت‌ها؛ `name` و `page` در URL نگهداری می‌شوند.
- `/characters/:id`: جزئیات شخصیت، آخرین مکان شناخته‌شده، مبدأ و قسمت‌ها.

هر دو مسیر با SSR رندر می‌شوند. برای استقرار، میزبان باید خروجی سرور Nuxt را اجرا کند؛ خروجی صرفاً ایستا برای شرط SSR کافی نیست.
