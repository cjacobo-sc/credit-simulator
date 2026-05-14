const errorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('debe')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Registro duplicado'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
