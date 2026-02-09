import Logger from '../utils/logger.js';

const logger = new Logger('Auth Middleware');

/**
 * Enhanced Error Handler Middleware
 * Handles all errors in the application
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Request error', {
    error: err.message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  // Validation error
  if (err.status === 400 || err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  // Not found error
  if (err.status === 404 || err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  // Unauthorized error
  if (err.status === 401 || err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Access denied',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  // Forbidden error
  if (err.status === 403 || err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden - You do not have permission',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  // Default error
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack,
      details: err
    } : {}
  });
};

/**
 * Request Logging Middleware
 * Logs all incoming requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info(`${req.method} ${req.path}`, {
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    contentType: req.get('content-type')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      status: res.statusCode
    });
  });

  next();
};

export default {
  errorHandler,
  requestLogger
};
