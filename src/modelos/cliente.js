const defineCliente = (sequelize, DataTypes) => {
    return sequelize.define('Cliente', {
        cliente_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        documento: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        correo: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true
            }
        }
    }, {
        tableName: 'cliente',
        timestamps: false
    });
};

module.exports = defineCliente;
