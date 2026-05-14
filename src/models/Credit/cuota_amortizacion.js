const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cuota_amortizacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    credito_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'creditos',
        key: 'id'
      }
    },
    numero_cuota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    monto_cuota: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    monto_capital: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    monto_interes: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    saldo_pendiente: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagada', 'vencida'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cuotas_amortizacion',
    timestamps: false,
    indexes: [
      {
        name: 'idx_credito_cuota',
        fields: ['credito_id', 'numero_cuota']
      },
      {
        name: 'idx_estado',
        fields: ['estado']
      }
    ]
  });
};
