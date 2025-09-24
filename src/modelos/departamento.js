const defineDepartamento = (sequelize, DataTypes) => {
    return sequelize.define('Departamento', {
        id_departamento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false 
            // autoIncrement: true 
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'departamento',
        timestamps: false
    });
};

module.exports = defineDepartamento;
