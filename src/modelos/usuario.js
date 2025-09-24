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
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'cliente', // nombre de la tabla
                key: 'cliente_id'
            }
        }
    }, {
        tableName: 'usuario',
        timestamps: false
    });
};

module.exports = defineUsuario;
