const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('escenario_comparacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comparacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'comparaciones',
        key: 'id'
      }
    },
    plazo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tasa: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    cuota_mensual: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    total_pagar: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    total_intereses: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    es_mejor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'escenarios_comparacion',
    timestamps: false,
    indexes: [
      {
        name: 'idx_comparacion',
        fields: ['comparacion_id']
      }
    ]
  });
};
