const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cliente', {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'clientes',
    timestamps: false,
    indexes: [
      {
        name: 'idx_email',
        fields: ['email']
      }
    ]
  });
};
