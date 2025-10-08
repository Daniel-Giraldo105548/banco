const defineCliente = (sequelize, DataTypes) => {
  return sequelize.define('Cliente', {
    cliente_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    documento: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    id_barrio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'barrio',
        key: 'id_barrio'
      }
    }
  }, {
    tableName: 'cliente',
    timestamps: false
  });
};

module.exports = defineCliente;
