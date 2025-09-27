
const defineComuna = (sequelize, DataTypes) => {
  return sequelize.define('Comuna', {
    id_comuna: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_municipio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'municipio', 
        key: 'id_municipio'
      }
    }
  }, {
    tableName: 'comuna',
    timestamps: false
  });
};

module.exports = defineComuna;
