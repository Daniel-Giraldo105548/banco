require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Importar modelos
const defineCliente = require('../modelos/cliente');
const defineUsuario = require('../modelos/usuario');
const defineBarrio = require('../modelos/barrio');
const defineCorresponsal = require('../modelos/corresponsal');
const defineDepartamento = require('../modelos/departamento');

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // necesario en Render
      },
    },
  }
);

// Definir modelos
const Cliente = defineCliente(sequelize, DataTypes);
const Departamento = defineDepartamento(sequelize, DataTypes);
const Barrio = defineBarrio(sequelize, DataTypes);
const Usuario = defineUsuario(sequelize, DataTypes);
const Corresponsal = defineCorresponsal(sequelize, DataTypes);

// Relaciones
Usuario.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Usuario, { foreignKey: 'cliente_id' });

Corresponsal.belongsTo(Barrio, { foreignKey: 'id_barrio' });
Barrio.hasMany(Corresponsal, { foreignKey: 'id_barrio' });

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
  sequelize
};
