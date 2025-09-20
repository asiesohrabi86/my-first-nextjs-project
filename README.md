<div dir="rtl">

# پروژه فروشگاه آنلاین با Next.js
[نسخه فارسی](#پروژه-فروشگاه-آنلاین-با-nextjs)

این یک پروژه فروشگاه آنلاین است که با استفاده از Next.js و MongoDB توسعه داده شده است. این پروژه شامل پنل مدیریت و بخش کاربری با ویژگی‌های متنوع می‌باشد.

## ویژگی‌های اصلی

### بخش کاربری
- 🛒 سبد خرید پویا
- 💳 سیستم کد تخفیف
- 📦 مدیریت سفارش‌ها
- 🏠 مدیریت آدرس‌ها
- 👤 احراز هویت کاربران
- 🎯 نمایش محصولات ویژه
- 🖼️ اسلاید تصاویر در صفحه اصلی
- 🏷️ نمایش برندها

### پنل مدیریت
- 📊 مدیریت محصولات
- 🎫 مدیریت کدهای تخفیف
- 🏢 مدیریت برندها
- 🖼️ مدیریت اسلایدشو
- 👥 مدیریت کاربران
- 📦 مدیریت سفارش‌ها

## تکنولوژی‌های استفاده شده

- **Frontend:** Next.js, React Bootstrap, React Icons
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **State Management:** React Context
- **Styling:** Bootstrap

## نصب و راه‌اندازی

1. ابتدا پروژه را کلون کنید:
```bash
git clone https://github.com/asiesohrabi86/my-first-nextjs-project.git
cd my-first-nextjs-project
```

2. وابستگی‌ها را نصب کنید:
```bash
npm install
```

3. فایل `.env.local` را در روت پروژه ایجاد کنید و متغیرهای محیطی زیر را تنظیم کنید:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. پروژه را در محیط توسعه اجرا کنید:
```bash
npm run dev
```

5. مرورگر را باز کنید و به آدرس `http://localhost:3000` بروید.

## ساختار پروژه

- `app/` - کامپوننت‌های صفحات و روت‌ها
- `app/api/` - API Routes
- `app/admin/` - کامپوننت‌های پنل مدیریت
- `app/components/` - کامپوننت‌های قابل استفاده مجدد
- `models/` - مدل‌های MongoDB
- `public/` - فایل‌های استاتیک

## قابلیت‌های امنیتی

- 🔒 احراز هویت با NextAuth.js
- 🔐 محافظت از روت‌های admin
- ✅ اعتبارسنجی در سمت سرور
- 🛡️ محافظت از API Routes

</div>

---

# Online Store Project with Next.js
[English Version](#online-store-project-with-nextjs)

This is an online store project developed using Next.js and MongoDB. The project includes both an admin panel and a user interface with various features.

## Key Features

### User Section
- 🛒 Dynamic Shopping Cart
- 💳 Discount Code System
- 📦 Order Management
- 🏠 Address Management
- 👤 User Authentication
- 🎯 Featured Products Display
- 🖼️ Homepage Image Slider
- 🏷️ Brands Display

### Admin Panel
- 📊 Product Management
- 🎫 Discount Code Management
- 🏢 Brand Management
- 🖼️ Slideshow Management
- 👥 User Management
- 📦 Order Management

## Technologies Used

- **Frontend:** Next.js, React Bootstrap, React Icons
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **State Management:** React Context
- **Styling:** Bootstrap

## Installation and Setup

1. First, clone the project:
```bash
git clone https://github.com/asiesohrabi86/my-first-nextjs-project.git
cd my-first-nextjs-project
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory and set up the following environment variables:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and go to `http://localhost:3000`

## Project Structure

- `app/` - Page components and routes
- `app/api/` - API Routes
- `app/admin/` - Admin panel components
- `app/components/` - Reusable components
- `models/` - MongoDB models
- `public/` - Static files

## Security Features

- 🔒 Authentication with NextAuth.js
- 🔐 Protected admin routes
- ✅ Server-side validation
- 🛡️ Protected API Routes

## Developer

[asiesohrabi86](https://github.com/asiesohrabi86)

## License

MIT