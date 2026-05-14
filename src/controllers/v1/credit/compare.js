const creditService = require('../../../services/credit');


module.exports = async (req, res, next) => {
  try {
    const { monto, escenarios, clienteId } = req.body;

    const resultado = await creditService.compararEscenarios(
      parseFloat(monto),
      escenarios,
      clienteId
    );

    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};
