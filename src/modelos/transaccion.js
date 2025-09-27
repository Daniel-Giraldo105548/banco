const defineTransaccion = (sequelize, DataTypes) => {
  const Transaccion = sequelize.define('Transaccion', {
    id_transaccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    id_cuenta_origen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuenta',
        key: 'id_cuenta'
      }
    },
    id_cuenta_destino: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuenta',
        key: 'id_cuenta'
      }
    },
    id_corresponsal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'corresponsal',
        key: 'id_corresponsal'
      }
    },
    id_tipo_transaccion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipo_transaccion',
        key: 'id_tipo_transaccion'
      }
    }
  }, {
    tableName: 'transaccion',
    timestamps: false
  });

  return Transaccion; 
};

module.exports = defineTransaccion;
