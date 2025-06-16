const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {

  const devConfig = config.development;
  sequelize = new Sequelize(
    devConfig.database,
    devConfig.username,
    devConfig.password,
    {
      host: devConfig.host,
      port: devConfig.port,
      dialect: devConfig.dialect
    }
  );
}

module.exports = sequelize;
