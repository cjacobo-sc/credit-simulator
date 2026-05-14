const creditService = require('../../../services/credit');

module.exports = async (req, res, next) => {
  try {
    const { clienteId } = req.params;

    const creditos = await creditService.obtenerHistorial(clienteId);

    res.status(200).json({
      success: true,
      data: {
        clienteId,
        total: creditos.length,
        creditos
      }
    });
  } catch (error) {
    next(error);
  }
};
