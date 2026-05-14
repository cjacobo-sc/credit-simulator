class AmortizationCalculator {
  calcularCuotaMensual(monto, plazo, tasaNominalAnual) {
    const tasaMensual = tasaNominalAnual / 12 / 100;
    
    if (tasaMensual === 0) {
      return monto / plazo;
    }

    const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                  (Math.pow(1 + tasaMensual, plazo) - 1);
    
    return Math.round(cuota * 100) / 100;
  }

  generarTablaCompleta(monto, plazo, tasaNominalAnual, cuotaMensual) {
    const tabla = [];
    let saldoInsoluto = monto;
    const tasaMensual = tasaNominalAnual / 12 / 100;

    for (let mes = 1; mes <= plazo; mes++) {
      const interes = Math.round(saldoInsoluto * tasaMensual * 100) / 100;
      const capital = Math.round((cuotaMensual - interes) * 100) / 100;
      saldoInsoluto = Math.round((saldoInsoluto - capital) * 100) / 100;

      if (mes === plazo && saldoInsoluto !== 0) {
        const ajuste = saldoInsoluto;
        saldoInsoluto = 0;
      }

      tabla.push({
        mes,
        cuota: cuotaMensual,
        capital: capital,
        interes: interes,
        saldoInsoluto: Math.max(0, saldoInsoluto)
      });
    }

    return tabla;
  }

  obtenerResumen(tablaCompleta) {
    const primeras3 = tablaCompleta.slice(0, 3);
    const ultimas3 = tablaCompleta.slice(-3);

    return {
      primeras3Cuotas: primeras3,
      ultimas3Cuotas: ultimas3,
      totalCuotas: tablaCompleta.length
    };
  }

  calcularTotales(tablaCompleta, cuotaMensual, plazo) {
    const totalIntereses = tablaCompleta.reduce((sum, row) => sum + row.interes, 0);
    const totalPagar = Math.round(cuotaMensual * plazo * 100) / 100;

    return {
      totalIntereses: Math.round(totalIntereses * 100) / 100,
      totalPagar: totalPagar
    };
  }
}

module.exports = new AmortizationCalculator();
