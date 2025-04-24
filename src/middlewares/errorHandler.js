export function errorHandler(err, req, res, next) {
    const statusCode = err.code === 'PRODUCT_NOT_FOUND' ? 404 : 400;
  
    res.status(statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.details || {},
    });
  }
  