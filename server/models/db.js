const Sequelize = require('sequelize');

const databaseUrl = 'postgres://localhost:5432/tripplanner';

const db = new Sequelize(databaseUrl, {
  logging: false,
  operatorsAliases: false,
});

module.exports = db;
