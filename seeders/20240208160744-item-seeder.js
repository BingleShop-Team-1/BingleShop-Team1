const { faker } = require('@faker-js/faker');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let items = [];
    for (let index = 0; index < 25; index++) {
      items[index] = {
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        image: faker.image.abstract(),
        stok: faker.datatype.number({ min: 5, max: 20, precision: 1 }),
        price: faker.commerce.price({ min: 50000, max: 2500000 }),
      };
    }

    await queryInterface.bulkInsert('Items', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
