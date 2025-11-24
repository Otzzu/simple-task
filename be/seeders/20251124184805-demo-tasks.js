'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const existingTasks = await queryInterface.rawSelect(
      'tasks',
      {
        limit: 1,
      },
      ['id']
    );
    if (!existingTasks) {
      await queryInterface.bulkInsert(
        'tasks',
        [
          {
            id: Sequelize.literal('uuid_generate_v4()'),
            title: 'Setup Backend Express',
            description: 'Membuat konfigurasi Sequelize, Docker, dan Migrations',
            status: 'Done',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: Sequelize.literal('uuid_generate_v4()'),
            title: 'Integrasi Frontend React',
            description: 'Menghubungkan API dengan axios dan menampilkan di Kanban Board',
            status: 'In Progress',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: Sequelize.literal('uuid_generate_v4()'),
            title: 'Deploy ke Production',
            description: null,
            status: 'To Do',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
      console.log('seeder dijalankan, data dummy ditambahkan');
    } else {
      console.log('seeder diskip, data sudah ada');
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tasks', null, {});
  },
};
