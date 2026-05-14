const DataTypes = require('sequelize').DataTypes;
const _cliente = require('./cliente');
const _credito = require('./credito');
const _cuota_amortizacion = require('./cuota_amortizacion');
const _comparacion = require('./comparacion');
const _escenario_comparacion = require('./escenario_comparacion');

function initModels(sequelize) {
  const cliente = _cliente(sequelize, DataTypes);
  const credito = _credito(sequelize, DataTypes);
  const cuota_amortizacion = _cuota_amortizacion(sequelize, DataTypes);
  const comparacion = _comparacion(sequelize, DataTypes);
  const escenario_comparacion = _escenario_comparacion(sequelize, DataTypes);

  credito.belongsTo(cliente, { 
    as: 'cliente', 
    foreignKey: 'cliente_id' 
  });
  cliente.hasMany(credito, { 
    as: 'creditos', 
    foreignKey: 'cliente_id' 
  });

  cuota_amortizacion.belongsTo(credito, { 
    as: 'credito', 
    foreignKey: 'credito_id' 
  });
  credito.hasMany(cuota_amortizacion, { 
    as: 'cuotas_amortizacion', 
    foreignKey: 'credito_id' 
  });

  comparacion.belongsTo(cliente, { 
    as: 'cliente', 
    foreignKey: 'cliente_id' 
  });
  cliente.hasMany(comparacion, { 
    as: 'comparaciones', 
    foreignKey: 'cliente_id' 
  });

  escenario_comparacion.belongsTo(comparacion, { 
    as: 'comparacion', 
    foreignKey: 'comparacion_id' 
  });
  comparacion.hasMany(escenario_comparacion, { 
    as: 'escenarios_comparacion', 
    foreignKey: 'comparacion_id' 
  });

  return {
    cliente,
    credito,
    cuota_amortizacion,
    comparacion,
    escenario_comparacion
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
