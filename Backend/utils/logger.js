/**
 * Logger Utility
 * Provides structured logging functionality
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  SUCCESS: 'SUCCESS'
};

const LOG_COLORS = {
  ERROR: '\x1b[31m',    // Red
  WARN: '\x1b[33m',     // Yellow
  INFO: '\x1b[36m',     // Cyan
  DEBUG: '\x1b[35m',    // Magenta
  SUCCESS: '\x1b[32m',  // Green
  RESET: '\x1b[0m'
};

class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level] || '';
    const reset = LOG_COLORS.RESET;

    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...data
    };

    console.log(
      `${color}[${timestamp}] [${level}] [${this.context}]${reset} ${message}`,
      Object.keys(data).length > 0 ? data : ''
    );

    // Store in error logs if it's an error
    if (level === 'ERROR') {
      this.storeErrorLog(logEntry);
    }
  }

  error(message, error = {}) {
    this.log('ERROR', message, {
      error: error.message || String(error),
      stack: error.stack
    });
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }

  success(message, data) {
    this.log('SUCCESS', message, data);
  }

  storeErrorLog(logEntry) {
    // In production, you would send this to a logging service like Sentry, LogRocket, etc.
    // For now, we just log to console
  }
}

export default Logger;
