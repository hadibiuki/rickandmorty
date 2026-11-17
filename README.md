# کاوشگر ریک و مورتی

وب‌اپ Nuxt 4 / Vue 3 با SSR، جست‌وجو، صفحه‌بندی و صفحهٔ جزئیات شخصیت‌ها.

نیازمند Node.js نسخهٔ `22.22.3` یا `24.15.0` به بالا است.

## اجرا

```bash
npm install
npm run dev
```

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

صفحه‌ها در سمت سرور تا یک ساعت کش می‌شوند. تصاویر کاراکترها با Nuxt Image در اندازه‌های واکنش‌گرا و فرمت WebP ارائه می‌شوند.

## فناوری‌ها

Nuxt 4، Vue 3، TypeScript و Tailwind CSS 4. داده‌ها از [Rick and Morty API](https://rickandmortyapi.com/documentation) دریافت می‌شوند و کلید API لازم نیست.

## مسیرها

- `/`: فهرست شخصیت‌ها؛ `name` و `page` در URL نگهداری می‌شوند.
- `/characters/:id`: جزئیات شخصیت، آخرین مکان شناخته‌شده، مبدأ و قسمت‌ها.

هر دو مسیر با SSR رندر می‌شوند. برای استقرار، میزبان باید خروجی سرور Nuxt را اجرا کند؛ خروجی صرفاً ایستا برای شرط SSR کافی نیست.
