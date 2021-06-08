'use strict';

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
    const now = new Date()
    const categories = ['Adventure', 'Action', 'Comedy', 'Animation', 'Horror', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi']
    const data = categories.map(c => ({ name: c, createdAt: now, updatedAt: now }))
    await queryInterface.bulkInsert('categories', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('categories', null, {});
  }
};
