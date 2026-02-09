# Backend Setup & MySQL Database Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create MySQL Database

```sql
CREATE DATABASE grocery_store;
CREATE USER 'grocery_user'@'localhost' IDENTIFIED BY 'grocery_password';
GRANT ALL PRIVILEGES ON grocery_store.* TO 'grocery_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=grocery_user
DB_PASSWORD=grocery_password
DB_NAME=grocery_store
DB_PORT=3306
CORS_ORIGIN=http://localhost:5173
```

### 4. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on: `http://localhost:5000`

---

## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  image_url VARCHAR(500),
  image_name VARCHAR(255),
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_active (is_active)
);
```

---

## 📊 Database Connection Details

### Connection Pool Configuration
- **Host**: localhost (or your MySQL server)
- **Port**: 3306 (default MySQL port)
- **User**: grocery_user
- **Password**: grocery_password (change in production)
- **Database**: grocery_store
- **Connection Limit**: 10
- **Queue Limit**: Unlimited

### File: `config/database.js`
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

---

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category

### Health Check
- `GET /api/health` - Server status

---

## 🖼️ Image Upload

- **Location**: `Backend/uploads/` directory
- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Served Via**: `http://localhost:5000/uploads/{filename}`

---

## 📁 Project Structure

```
Backend/
├── config/
│   ├── database.js          # MySQL connection pool
│   └── initDb.js            # Database initialization
├── controllers/
│   ├── productsController.js
│   └── categoriesController.js
├── middleware/
│   └── auth.js              # Error handling
├── routes/
│   ├── products.js
│   └── categories.js
├── uploads/                 # Product images
├── .env.example             # Config template
├── server.js                # Main server file
├── package.json
└── README.md
```

---

## 🧪 Testing API Endpoints

### Using curl

**Get all products:**
```bash
curl http://localhost:5000/api/products
```

**Get all categories:**
```bash
curl http://localhost:5000/api/categories
```

**Create category:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Vegetables","description":"Fresh vegetables"}'
```

**Create product (with image):**
```bash
curl -X POST http://localhost:5000/api/products \
  -F "name=Tomatoes" \
  -F "description=Fresh red tomatoes" \
  -F "price=5.99" \
  -F "category_id=1" \
  -F "stock=50" \
  -F "image=@path/to/image.jpg"
```

---

## 🔍 Troubleshooting

### Database Connection Errors

**Error: "connect ECONNREFUSED 127.0.0.1:3306"**
- MySQL is not running
- Verify MySQL service is started
- Check database credentials in .env

**Error: "Access denied for user 'root'@'localhost'"**
- Wrong password in .env
- Verify user was created in MySQL

**Error: "Unknown database 'grocery_store'"**
- Database doesn't exist
- Run the SQL CREATE DATABASE command

### Server Won't Start

**Error: "Port 5000 already in use"**
- Change PORT in .env to 5001 or another available port
- Or kill the process using port 5000

### File Upload Issues

**Error: "ENOENT: no such file or directory, open '.../uploads/...'"**
- Create uploads directory: `mkdir Backend/uploads`
- Check directory permissions

---

## 📝 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| DB_HOST | localhost | MySQL host |
| DB_USER | root | MySQL username |
| DB_PASSWORD | - | MySQL password |
| DB_NAME | grocery_store | Database name |
| DB_PORT | 3306 | MySQL port |
| CORS_ORIGIN | http://localhost:5173 | Frontend URL |

---

## 🔧 Advanced Configuration

### Custom MySQL Port

If MySQL runs on different port (e.g., 3307):
```env
DB_PORT=3307
```

### Remote MySQL Server

```env
DB_HOST=your-remote-server.com
DB_USER=remote_user
DB_PASSWORD=remote_password
```

### Production Deployment

Before deploying:
1. Change all passwords in .env
2. Update CORS_ORIGIN to your frontend domain
3. Use secure SSL/TLS connections
4. Enable database backups
5. Set up monitoring

---

## 💾 Database Backup

### Backup Database
```bash
mysqldump -u grocery_user -p grocery_store > backup.sql
```

### Restore Database
```bash
mysql -u grocery_user -p grocery_store < backup.sql
```

---

## 📦 Dependencies

- **express**: Web framework
- **mysql2**: MySQL client with promise support
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **multer**: File upload handling

---

## ✅ Verification Checklist

- [ ] MySQL server is running
- [ ] Database created
- [ ] User created with privileges
- [ ] .env file configured
- [ ] Dependencies installed (npm install)
- [ ] Backend starts without errors
- [ ] API responds at http://localhost:5000/api/health
- [ ] Database tables are created
- [ ] uploads directory exists

---

## 🎯 Next Steps

1. Start backend: `npm run dev`
2. Start frontend: `cd Frontend && npm run dev`
3. Open admin panel at http://localhost:5173/admin/login
4. Enter password: `n1$#@D16`
5. Start managing products!

---

## 📞 Support

- Check console for error messages
- Verify .env variables match your MySQL setup
- Ensure MySQL user has all privileges on database
- Check Backend/uploads directory exists and has write permissions

