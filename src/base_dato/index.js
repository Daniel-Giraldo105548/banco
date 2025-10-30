require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Importar funciones que definen los modelos
const defineCliente = require('../modelos/cliente');
const defineUsuario = require('../modelos/usuario');
const defineDepartamento = require('../modelos/departamento');
const defineMunicipio = require('../modelos/municipio');
const defineBarrio = require('../modelos/barrio');
const defineCorresponsal = require('../modelos/corresponsal');
const defineComuna = require('../modelos/comua');
const defineCuenta = require('../modelos/cuenta');
const defineTransaccion = require('../modelos/transaccion');
const defineTipoTransaccion = require('../modelos/tipo_transaccion');

// ✅ Conexión a PostgreSQL (Render)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Render requiere SSL
    }
  },
  logging: false
});

// Probar conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conectado correctamente a la base de datos.'))
  .catch(err => console.error('❌ No se pudo conectar a la base de datos:', err));

// Definir modelos
const Cliente = defineCliente(sequelize, DataTypes);
const Usuario = defineUsuario(sequelize, DataTypes);
const Departamento = defineDepartamento(sequelize, DataTypes);
const Municipio = defineMunicipio(sequelize, DataTypes);
const Barrio = defineBarrio(sequelize, DataTypes);
const Corresponsal = defineCorresponsal(sequelize, DataTypes);
const Comuna = defineComuna(sequelize, DataTypes);
const Cuenta = defineCuenta(sequelize, DataTypes);
const Transaccion = defineTransaccion(sequelize, DataTypes);
const TipoTransaccion = defineTipoTransaccion(sequelize, DataTypes);

// 🔗 Relaciones
Usuario.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Cliente.hasMany(Usuario, { foreignKey: 'id_cliente' });

Corresponsal.belongsTo(Barrio, { foreignKey: 'id_barrio' });
Barrio.hasMany(Corresponsal, { foreignKey: 'id_barrio' });

Municipio.belongsTo(Departamento, { foreignKey: 'id_departamento' });
Departamento.hasMany(Municipio, { foreignKey: 'id_departamento' });

Comuna.belongsTo(Municipio, { foreignKey: 'id_municipio' });
Municipio.hasMany(Comuna, { foreignKey: 'id_municipio' });

Barrio.belongsTo(Comuna, { foreignKey: 'id_comuna' });
Comuna.hasMany(Barrio, { foreignKey: 'id_comuna' });

Cuenta.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Cliente.hasMany(Cuenta, { foreignKey: 'id_cliente' });

Transaccion.belongsTo(Cuenta, { foreignKey: 'id_cuenta_origen', as: 'cuentaOrigen' });
Cuenta.hasMany(Transaccion, { foreignKey: 'id_cuenta_origen', as: 'transaccionesOrigen' });

Transaccion.belongsTo(Cuenta, { foreignKey: 'id_cuenta_destino', as: 'cuentaDestino' });
Cuenta.hasMany(Transaccion, { foreignKey: 'id_cuenta_destino', as: 'transaccionesDestino' });

Transaccion.belongsTo(Corresponsal, { foreignKey: 'id_corresponsal', as: 'corresponsal' });
Corresponsal.hasMany(Transaccion, { foreignKey: 'id_corresponsal', as: 'transacciones' });

Transaccion.belongsTo(TipoTransaccion, { foreignKey: 'id_tipo_transaccion', as: 'tipoTransaccion' });
TipoTransaccion.hasMany(Transaccion, { foreignKey: 'id_tipo_transaccion', as: 'transacciones' });

Cliente.belongsTo(Barrio, { foreignKey: 'id_barrio' });
Barrio.hasMany(Cliente, { foreignKey: 'id_barrio' });

// Exportar
module.exports = {
  Cliente,
  Usuario,
  Departamento,
  Municipio,
  Barrio,
  Corresponsal,
  Comuna,
  Cuenta,
  Transaccion,
  TipoTransaccion,
  sequelize
};
