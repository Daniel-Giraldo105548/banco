require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

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

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // importante para Render
      }
    }
  }
);

// Definición de modelos
const Cliente = defineCliente(sequelize, DataTypes);
const Departamento = defineDepartamento(sequelize, DataTypes);
const Municipio = defineMunicipio(sequelize, DataTypes);
const Barrio = defineBarrio(sequelize, DataTypes);
const Usuario = defineUsuario(sequelize, DataTypes);
const Corresponsal = defineCorresponsal(sequelize, DataTypes);
const Comuna = defineComuna(sequelize, DataTypes);
const Cuenta = defineCuenta(sequelize, DataTypes);
const Transaccion = defineTransaccion(sequelize, DataTypes);
const TipoTransaccion = defineTipoTransaccion(sequelize, DataTypes);

// Cliente ↔ Usuario
Usuario.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Usuario, { foreignKey: 'cliente_id' });

// Corresponsal ↔ Barrio
Corresponsal.belongsTo(Barrio, { foreignKey: 'id_barrio' });
Barrio.hasMany(Corresponsal, { foreignKey: 'id_barrio' });

// Municipio ↔ Departamento
Municipio.belongsTo(Departamento, { foreignKey: 'id_departamento' });
Departamento.hasMany(Municipio, { foreignKey: 'id_departamento' });

// Comuna ↔ Municipio
Comuna.belongsTo(Municipio, { foreignKey: 'id_municipio' });
Municipio.hasMany(Comuna, { foreignKey: 'id_municipio' });

// Barrio ↔ Comuna
Barrio.belongsTo(Comuna, { foreignKey: 'id_comuna' });
Comuna.hasMany(Barrio, { foreignKey: 'id_comuna' });

// **Cuenta ↔ Cliente** (muy importante)
Cuenta.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Cliente.hasMany(Cuenta, { foreignKey: 'id_cliente' });


// Transaccion ↔ Cuenta (origen y destino)
Transaccion.belongsTo(Cuenta, { foreignKey: 'id_cuenta_origen', as: 'cuentaOrigen' });
Cuenta.hasMany(Transaccion, { foreignKey: 'id_cuenta_origen', as: 'transaccionesOrigen' });

Transaccion.belongsTo(Cuenta, { foreignKey: 'id_cuenta_destino', as: 'cuentaDestino' });
Cuenta.hasMany(Transaccion, { foreignKey: 'id_cuenta_destino', as: 'transaccionesDestino' });

// Transaccion ↔ Corresponsal
Transaccion.belongsTo(Corresponsal, { foreignKey: 'id_corresponsal', as: 'corresponsal' });
Corresponsal.hasMany(Transaccion, { foreignKey: 'id_corresponsal', as: 'transacciones' });

// Transaccion ↔ TipoTransaccion (opcional)
Transaccion.belongsTo(TipoTransaccion, { foreignKey: 'id_tipo_transaccion', as: 'tipoTransaccion' });
TipoTransaccion.hasMany(Transaccion, { foreignKey: 'id_tipo_transaccion', as: 'transacciones' });

// Probar conexión
sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

module.exports = {
  Cliente,
  Barrio,
  Usuario,
  Corresponsal,
  Departamento,
  Municipio,
  Comuna,
  Cuenta,
  Transaccion,
  TipoTransaccion,
  sequelize
};
