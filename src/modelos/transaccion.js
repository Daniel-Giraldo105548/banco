const defineTransaccion = (sequelize, DataTypes) => {
    return sequelize.define('Transaccion', {
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
            allowNull: true
        },
        id_cuenta_destino: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_corresponsal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_tipo_transaccion: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'transaccion',
        timestamps: false
    });
};

module.exports = defineTransaccion;
