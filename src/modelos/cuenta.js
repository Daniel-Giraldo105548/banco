const defineCuenta = (sequelize, DataTypes) => {
    return sequelize.define('Cuenta', {
        id_cuenta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero_cuenta: {
            type: DataTypes.STRING(7), // será un string de 7 dígitos
            allowNull: false,
            unique: true
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        saldo: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        fecha_apertura: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        tipo_cuenta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_cliente: {
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
