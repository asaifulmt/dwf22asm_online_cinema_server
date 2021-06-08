'use strict';
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const secretKey = 'inikuncirahasia'
     const hashStrength = 10
     const now = new Date()

     await queryInterface.bulkInsert('users', [{
      fullName: 'Admin',
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin', hashStrength),
      role: 'admin',
      createdAt: now,
      updatedAt: now
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {})
  }
};
