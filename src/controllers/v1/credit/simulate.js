const creditService = require('../../../services/credit');

module.exports = async (req, res, next) => {
  try {
    const { monto, plazo, tasa, clienteId } = req.body;

    const resultado = await creditService.simular(
      parseFloat(monto),
      parseInt(plazo),
      parseFloat(tasa),
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
