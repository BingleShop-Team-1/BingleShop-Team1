const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let users = [];
    for (let index = 0; index < 5; index++) {
      users[index] = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        // bcrypt (plainText, saltRounds)
        password: bcrypt.hashSync('pass123', 10),
      }
    }

    users.push({
      name: 'Admin',
      email: 'admin@bingle.com',
      password: bcrypt.hashSync('admin123', 10),
    })

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
