module.exports = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servicio de crédito funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
