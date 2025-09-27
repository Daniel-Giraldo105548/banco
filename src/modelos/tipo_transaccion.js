const defineTipoTransaccion = (sequelize, DataTypes) => {
  const TipoTransaccion = sequelize.define('TipoTransaccion', {
    id_tipo_transaccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'tipo_transaccion',
    timestamps: false
  });

  return TipoTransaccion;
};

module.exports = defineTipoTransaccion;
