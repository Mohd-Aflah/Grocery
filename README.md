# Abdul Rasheed Grocery | بقالة عبدالرشيد

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> Your trusted neighborhood grocery store in Sayh Mudayrah, Ajman, UAE 🛒

## 🌟 About

Abdul Rasheed Grocery is a family-owned neighborhood grocery store serving the community of Sayh Mudayrah in Ajman, UAE. We pride ourselves on providing fresh groceries, quality service, and convenient access to daily essentials.

This application provides:
- 🛒 Product catalog with categories
- 📍 Store location and contact information
- 🖼️ Product image gallery with admin management
- 🔐 Admin dashboard for product and gallery management
- 🌍 Bilingual support (English & Arabic)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Setup Instructions

```bash
# 1. Backend
cd Backend
npm install
cp .env.example .env
# Edit .env with your database credentials and Cloudinary API keys
npm run dev

# 2. Frontend (new terminal)
cd Frontend
npm install
# Edit .env with admin password
npm run dev

# 3. Open http://localhost:5173
```
## 📂 Project Structure

```
Backend/
├── config/
│   ├── database.js           # MySQL connection pool
│   └── initDb.js             # Database schema initialization
├── controllers/
│   ├── productsController.js
│   ├── categoriesController.js
│   └── galleryController.js
├── routes/
│   ├── products.js
│   ├── categories.js
│   └── gallery.js
├── middleware/
│   └── auth.js               # Authentication
├── server.js
├── package.json
└── .env                      # Database & Cloudinary config

Frontend/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.tsx    # Admin authentication
│   │   ├── AdminDashboard.tsx # Product & gallery management
│   │   ├── ProductsPage.tsx   # Product listing
│   │   └── Index.tsx          # Homepage
│   ├── components/            # UI components & gallery
│   ├── contexts/              # Language & theme context
│   ├── lib/api.ts             # API client
│   └── main.tsx
├── .env                       # Admin password & API URL
└── package.json
```

## 🔐 Admin Access

- **URL**: `http://localhost:5173/admin`
- **Password**: Set in `Frontend/.env` as `VITE_ADMIN_PASSWORD`

## 📊 API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (with Cloudinary image)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Gallery Images
- `GET /api/gallery` - List all gallery images
- `POST /api/gallery` - Upload single image
- `POST /api/gallery/bulk-upload` - Upload multiple images (up to 20)
- `DELETE /api/gallery/:id` - Delete gallery image
- `POST /api/gallery/bulk-delete` - Delete multiple gallery images

## 🐛 Troubleshooting

**MySQL Connection Error?**
- Check MySQL is running
- Verify credentials in `Backend/.env` match your MySQL setup
- Ensure database and user exist

**Port Already in Use?**
- Change PORT in `Backend/.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

**Image Upload Not Working?**
- Ensure Cloudinary credentials are set in `Backend/.env`
- Verify image file under 5MB and is .jpg/.png
- Check internet connection for Cloudinary upload

**Admin Login Issues?**
- Verify `VITE_ADMIN_PASSWORD` is set in `Frontend/.env`
- Clear browser localStorage and try again

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

## 👨‍💻 Developer

**Mohammed Afflah** - [@Mohd-Aflah](https://github.com/Mohd-Aflah)

---

<div align="center">
Made with ❤️ by Mohammed Aflah | © 2026 Abdul Rasheed Grocery
</div>
