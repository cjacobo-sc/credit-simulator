const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('credito', {
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
    plazo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tasa_nominal_anual: {
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
    estado: {
      type: DataTypes.ENUM('simulado', 'aprobado', 'rechazado', 'activo', 'finalizado'),
      allowNull: false,
      defaultValue: 'simulado'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'creditos',
    timestamps: false,
    indexes: [
      {
        name: 'idx_cliente_fecha',
        fields: ['cliente_id', { name: 'fecha_creacion', order: 'DESC' }]
      },
      {
        name: 'idx_estado',
        fields: ['estado']
      }
    ]
  });
};
