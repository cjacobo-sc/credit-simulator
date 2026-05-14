const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comparacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cliente_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    mejor_escenario_indice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'comparaciones',
    timestamps: false,
    indexes: [
      {
        name: 'idx_cliente',
        fields: ['cliente_id']
      }
    ]
  });
};
