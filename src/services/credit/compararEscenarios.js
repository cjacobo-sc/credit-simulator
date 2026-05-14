const simular = require('./simular');
const creditModel = require('../../models/CreditModel');

module.exports = async (monto, escenarios, clienteId = null) => {
  if (!escenarios || escenarios.length === 0 || escenarios.length > 3) {
    throw new Error('Debe proporcionar entre 1 y 3 escenarios para comparar');
  }

  const resultados = [];
  for (const escenario of escenarios) {
    const { plazo, tasa } = escenario;
    const simulacion = await simular(monto, plazo, tasa);
    
    resultados.push({
      escenario: {
        plazo,
        tasa
      },
      resultado: {
        cuotaMensual: simulacion.cuotaMensual,
        totalPagar: simulacion.totalPagar,
        totalIntereses: simulacion.totalIntereses,
        primeras3Cuotas: simulacion.primeras3Cuotas,
        ultimas3Cuotas: simulacion.ultimas3Cuotas
      }
    });
  }

  const mejorEscenario = determinarMejorEscenario(resultados);

  if (clienteId) {
    await creditModel.saveComparison(clienteId, monto, resultados, mejorEscenario.indice);
    
    const mejorSimulacion = resultados[mejorEscenario.indice - 1];
    await simular(
      monto,
      mejorSimulacion.escenario.plazo,
      mejorSimulacion.escenario.tasa,
      clienteId
    );
  }

  return {
    monto,
    escenarios: resultados,
    recomendacion: mejorEscenario
  };
};

function determinarMejorEscenario(resultados) {
  let mejorIndice = 0;
  let menorCosto = resultados[0].resultado.totalPagar;

  resultados.forEach((resultado, index) => {
    if (resultado.resultado.totalPagar < menorCosto) {
      menorCosto = resultado.resultado.totalPagar;
      mejorIndice = index;
    }
  });

  const mejorEscenario = resultados[mejorIndice];

  return {
    indice: mejorIndice + 1,
    plazo: mejorEscenario.escenario.plazo,
    tasa: mejorEscenario.escenario.tasa,
    totalPagar: mejorEscenario.resultado.totalPagar,
    totalIntereses: mejorEscenario.resultado.totalIntereses,
    cuotaMensual: mejorEscenario.resultado.cuotaMensual,
    razon: 'Menor costo total para el cliente',
    ahorro: calcularAhorro(resultados, mejorIndice)
  };
}

function calcularAhorro(resultados, mejorIndice) {
  const costos = resultados.map(r => r.resultado.totalPagar);
  const mayorCosto = Math.max(...costos);
  const menorCosto = costos[mejorIndice];
  
  return Math.round((mayorCosto - menorCosto) * 100) / 100;
}
