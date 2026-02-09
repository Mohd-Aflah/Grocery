import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeDatabase from './config/initDb.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import galleryRoutes from './routes/gallery.js';
import { errorHandler, requestLogger } from './middleware/auth.js';
import Logger from './utils/logger.js';

dotenv.config();

const logger = new Logger('Server');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - support multiple origins
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim());

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost variations (5173, 5174, etc for development)
    if (origin.includes('localhost')) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Reject if not allowed
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Request logging
app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is running',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/api/health'
    }
  });
});

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    logger.success('Database initialized successfully');
    
    app.listen(PORT, () => {
      logger.success(`Server running on http://localhost:${PORT}`);
      logger.success(`API available at http://localhost:${PORT}/api`);
      logger.info('Environment', { 
        NODE_ENV: process.env.NODE_ENV || 'development',
        CORS_ORIGINS: allowedOrigins.join(', ')
      });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

export default app;
