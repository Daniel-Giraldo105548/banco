const defineBarrio = (sequelize, DataTypes) => {
    return sequelize.define('Barrio', {
        id_barrio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_comuna: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'comuna',   // nombre de la tabla referenciada
                key: 'id_comuna'   // columna de la tabla referenciada
            },
        }
    }, {
        tableName: 'barrio',
        timestamps: false
    });
};

module.exports = defineBarrio;
