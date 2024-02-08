const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bingle', 'postgres', 'postgresql', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize