const Sequelize = require('sequelize');

// const databaseUrl = 'postgres://localhost:5432/tripplanner';
const databaseUrl =
  'postgres://djkocjbqmjhrww:dd4d10fa4e2cdae5f1aaf9a7802d068e64d3c151b1a7a2a1ccfe4ac376590182@ec2-75-101-147-226.compute-1.amazonaws.com:5432/df4tkcsr4pc34b';

const db = new Sequelize(databaseUrl, {
  logging: false,
  operatorsAliases: false,
});

module.exports = db;
