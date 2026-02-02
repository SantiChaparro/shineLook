require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require('fs');
const path = require('path');
const Tenant = require("./models/Tenant");
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
} = process.env;

//console.log("DB_DEPLOY:", process.env.DB_DEPLOY,DB_USER);

let sequelize;

if (process.env.DB_DEPLOY) {
  // 👉 Render / Producción
  sequelize = new Sequelize(process.env.DB_DEPLOY, {
    logging: false,
    native: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // 👉 Local
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
  });
}
// --- BLOQUE TEMPORAL PARA PROBAR CONEXIÓN ---
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa!");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
})();
// --- FIN BLOQUE TEMPORAL ---


const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });


modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Appointment, Client, Payment, Professional, Service, Commission,Tenants, TenantProfessional,TenantClient } = sequelize.models;

Tenants.belongsToMany(Professional, { through:TenantProfessional,foreignKey: 'TenantId' });
Professional.belongsToMany(Tenants, { through:TenantProfessional, foreignKey: 'ProfessionalDni' });

Tenants.belongsToMany(Client, { through:TenantClient });
Client.belongsToMany(Tenants, { through:TenantClient });

TenantClient.belongsTo(Client, { foreignKey: 'ClientDni' });
Client.hasMany(TenantClient, { foreignKey: 'ClientDni' });

TenantClient.belongsTo(Tenants, { foreignKey: 'TenantId' });
Tenants.hasMany(TenantClient, { foreignKey: 'TenantId' });

TenantProfessional.belongsTo(Professional, { foreignKey: 'ProfessionalDni' });
Professional.hasMany(TenantProfessional, { foreignKey: 'ProfessionalDni' });

TenantProfessional.belongsTo(Tenants, { foreignKey: 'TenantId' });
Tenants.hasMany(TenantProfessional, { foreignKey: 'TenantId' });


Tenants.hasMany(Service);
Service.belongsTo(Tenants);

// Tenants.hasMany(Commission);
// Commission.belongsTo(Tenants);
// si no anda borra foreignKey: 'TenantId'
Tenants.hasMany(Commission, { foreignKey: 'TenantId',as: 'commissions' });
Commission.belongsTo(Tenants, { foreignKey: 'TenantId',as: 'tenant' });

Tenants.hasMany(Payment);
Payment.belongsTo(Tenants);

Tenants.hasMany(Appointment);
Appointment.belongsTo(Tenants);

Service.hasMany(Commission);
Commission.belongsTo(Service);

Professional.hasMany(Commission);
Commission.belongsTo(Professional);

Appointment.belongsTo(Professional);
Professional.hasMany(Appointment);

Appointment.belongsTo(Service);
Service.hasMany(Appointment);

Appointment.belongsTo(Client);
Client.hasMany(Appointment);

// Appointment.belongsTo(Payment);
// Payment.hasMany(Appointment);

Appointment.hasMany(Payment);
Payment.belongsTo(Appointment);

Appointment.hasOne(Commission);
Commission.belongsTo(Appointment);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};