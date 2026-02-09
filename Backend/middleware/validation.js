/**
 * Input Validation Middleware
 * Validates and sanitizes incoming requests
 */

import { body, param, query, validationResult } from 'express-validator';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category_id')
    .notEmpty().withMessage('Category is required')
    .isInt().withMessage('Category ID must be an integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

export const validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
];

export const validateProductId = [
  param('id')
    .isInt().withMessage('Product ID must be an integer'),
];

export const validateCategoryId = [
  param('id')
    .isInt().withMessage('Category ID must be an integer'),
];

export const validateQueryParams = [
  query('category_id')
    .optional()
    .isInt().withMessage('Category ID must be an integer'),
  query('is_active')
    .optional()
    .isIn(['true', 'false']).withMessage('is_active must be true or false'),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

export default {
  validateProduct,
  validateCategory,
  validateProductId,
  validateCategoryId,
  validateQueryParams,
  handleValidationErrors
};
