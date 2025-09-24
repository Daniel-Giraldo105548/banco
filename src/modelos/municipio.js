const defineMunicipio = (sequelize, DataTypes) => {
  return sequelize.define('Municipio', {
    id_municipio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_departamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departamento',
        key: 'id_departamento'   
      }
    }
  }, {
    tableName: 'municipio',
    timestamps: false
  });
};

module.exports = defineMunicipio;
