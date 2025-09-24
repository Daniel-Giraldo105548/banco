const defineCorresponsal = (sequelize, DataTypes) => {
    return sequelize.define('Corresponsal', {
        id_corresponsal: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        latitud: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true

        },
        longitud: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        id_barrio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
                model: 'barrio',
                key: 'id_barrio'
            }
        }
    }, {
        tableName: 'corresponsal',
        timestamps: false
    });
};

module.exports = defineCorresponsal;
