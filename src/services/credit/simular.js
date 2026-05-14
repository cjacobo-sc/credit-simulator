const amortizationCalculator = require('../AmortizationCalculator');
const creditModel = require('../../models/CreditModel');

module.exports = async (monto, plazo, tasaNominalAnual, clienteId = null) => {
  validarParametros(monto, plazo, tasaNominalAnual);

  const cuotaMensual = amortizationCalculator.calcularCuotaMensual(monto, plazo, tasaNominalAnual);
  const tablaCompleta = amortizationCalculator.generarTablaCompleta(
    monto, 
    plazo, 
    tasaNominalAnual, 
    cuotaMensual
  );
  const resumen = amortizationCalculator.obtenerResumen(tablaCompleta);
  const { totalIntereses, totalPagar } = amortizationCalculator.calcularTotales(
    tablaCompleta, 
    cuotaMensual, 
    plazo
  );

  const resultado = {
    monto,
    plazo,
    tasaNominalAnual,
    cuotaMensual,
    totalPagar,
    totalIntereses,
    ...resumen
  };

  if (clienteId) {
    const creditData = {
      clienteId,
      monto,
      plazo,
      tasaNominalAnual,
      cuotaMensual,
      totalPagar,
      totalIntereses,
      tablaAmortizacion: tablaCompleta
    };

    const creditoId = await creditModel.save(creditData);
    resultado.creditoId = creditoId;
  }

  return resultado;
};

function validarParametros(monto, plazo, tasaNominalAnual) {
  if (monto <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  if (plazo <= 0 || plazo > 120) {
    throw new Error('El plazo debe estar entre 1 y 120 meses');
  }
  if (tasaNominalAnual < 0 || tasaNominalAnual > 100) {
    throw new Error('La tasa de interés debe estar entre 0 y 100');
  }
}
