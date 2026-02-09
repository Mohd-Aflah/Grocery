/**
 * API Response Utility
 * Provides standardized response formatting
 */

export const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data
  };
};

export const errorResponse = (message = 'Error', statusCode = 500, errors = null) => {
  return {
    success: false,
    statusCode,
    message,
    errors
  };
};

export const paginatedResponse = (data, page = 1, limit = 10, total = 0) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse
};
