const defineCuenta = (sequelize, DataTypes) => {
    return sequelize.define('Cuenta', {
        id_cuenta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero_cuenta: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        saldo: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        fecha_apertura: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        tipo_cuenta: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cliente', 
                key: 'cliente_id'
            }
        }
    }, {
        tableName: 'cuenta',
        timestamps: false
    });
};

module.exports = defineCuenta;
