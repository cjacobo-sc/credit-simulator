const { sequelize } = require('../utils/mysql/mysql.config');
const initModels = require('./Credit/init-models');

const models = initModels(sequelize);

class CreditModel {
  async ensureClient(clienteId) {
    const [client, created] = await models.cliente.findOrCreate({
      where: { id: clienteId },
      defaults: { id: clienteId }
    });
    return client;
  }

  async save(creditData) {
    const transaction = await sequelize.transaction();

    try {
      await this.ensureClient(creditData.clienteId);

      const credito = await models.credito.create({
        cliente_id: creditData.clienteId,
        monto: creditData.monto,
        plazo: creditData.plazo,
        tasa_nominal_anual: creditData.tasaNominalAnual,
        cuota_mensual: creditData.cuotaMensual,
        total_pagar: creditData.totalPagar,
        total_intereses: creditData.totalIntereses,
        estado: 'simulado'
      }, { transaction });

      if (creditData.tablaAmortizacion && creditData.tablaAmortizacion.length > 0) {
        const cuotas = creditData.tablaAmortizacion.map(cuota => ({
          credito_id: credito.id,
          numero_cuota: cuota.mes,
          monto_cuota: cuota.cuota,
          monto_capital: cuota.capital,
          monto_interes: cuota.interes,
          saldo_pendiente: cuota.saldoInsoluto,
          estado: 'pendiente'
        }));

        await models.cuota_amortizacion.bulkCreate(cuotas, { transaction });
      }

      await transaction.commit();
      return credito.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findByClientId(clienteId) {
    const creditos = await models.credito.findAll({
      where: { cliente_id: clienteId },
      attributes: [
        ['id', 'id'],
        ['cliente_id', 'clienteId'],
        ['monto', 'monto'],
        ['plazo', 'plazo'],
        ['tasa_nominal_anual', 'tasaNominalAnual'],
        ['cuota_mensual', 'cuotaMensual'],
        ['total_pagar', 'totalPagar'],
        ['total_intereses', 'totalIntereses'],
        ['estado', 'estado'],
        ['fecha_creacion', 'fechaCreacion']
      ],
      include: [
        {
          model: models.cuota_amortizacion,
          as: 'cuotas_amortizacion',
          attributes: [
            ['numero_cuota', 'mes'],
            ['monto_cuota', 'cuota'],
            ['monto_capital', 'capital'],
            ['monto_interes', 'interes'],
            ['saldo_pendiente', 'saldoInsoluto'],
            ['estado', 'estado'],
            ['fecha_vencimiento', 'fechaVencimiento'],
            ['fecha_pago', 'fechaPago']
          ],
          order: [['numero_cuota', 'ASC']]
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });

    return creditos.map(credito => {
      const data = credito.get({ plain: true });
      data.tablaAmortizacion = data.cuotas_amortizacion;
      delete data.cuotas_amortizacion;
      return data;
    });
  }

  async findById(id) {
    const credito = await models.credito.findOne({
      where: { id },
      attributes: [
        ['id', 'id'],
        ['cliente_id', 'clienteId'],
        ['monto', 'monto'],
        ['plazo', 'plazo'],
        ['tasa_nominal_anual', 'tasaNominalAnual'],
        ['cuota_mensual', 'cuotaMensual'],
        ['total_pagar', 'totalPagar'],
        ['total_intereses', 'totalIntereses'],
        ['estado', 'estado'],
        ['fecha_creacion', 'fechaCreacion']
      ],
      include: [
        {
          model: models.cuota_amortizacion,
          as: 'cuotas_amortizacion',
          attributes: [
            ['numero_cuota', 'mes'],
            ['monto_cuota', 'cuota'],
            ['monto_capital', 'capital'],
            ['monto_interes', 'interes'],
            ['saldo_pendiente', 'saldoInsoluto'],
            ['estado', 'estado'],
            ['fecha_vencimiento', 'fechaVencimiento'],
            ['fecha_pago', 'fechaPago']
          ],
          order: [['numero_cuota', 'ASC']]
        }
      ]
    });

    if (!credito) {
      return null;
    }

    const data = credito.get({ plain: true });
    data.tablaAmortizacion = data.cuotas_amortizacion;
    delete data.cuotas_amortizacion;
    return data;
  }

  async saveComparison(clienteId, monto, escenarios, mejorIndice) {
    const transaction = await sequelize.transaction();

    try {
      await this.ensureClient(clienteId);

      const comparacion = await models.comparacion.create({
        cliente_id: clienteId,
        monto: monto,
        mejor_escenario_indice: mejorIndice
      }, { transaction });

      if (escenarios && escenarios.length > 0) {
        const escenariosData = escenarios.map((esc, idx) => ({
          comparacion_id: comparacion.id,
          plazo: esc.escenario.plazo,
          tasa: esc.escenario.tasa,
          cuota_mensual: esc.resultado.cuotaMensual,
          total_pagar: esc.resultado.totalPagar,
          total_intereses: esc.resultado.totalIntereses,
          es_mejor: idx === mejorIndice - 1
        }));

        await models.escenario_comparacion.bulkCreate(escenariosData, { transaction });
      }

      await transaction.commit();
      return comparacion.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new CreditModel();
