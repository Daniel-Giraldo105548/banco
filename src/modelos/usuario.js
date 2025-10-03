const defineUsuario = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM(
                'CLIENTE',
                'ADMIN_DB',
                'BACKOFFICE',
                'ASESOR',
                'AUDITOR',
                'ADMIN'
            ),
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(20),
            defaultValue: 'ACTIVO'
        },
        id_cliente: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'id_cliente',   // asegura que mapea a la columna real
            references: {
                model: 'cliente',  // tabla referenciada
                key: 'cliente_id'  // PK de cliente
            }
        }
    }, {
        tableName: 'usuario',
        timestamps: false
    });
};

module.exports = defineUsuario;
