'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_Registers', {
      user_register_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      user_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      user_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      user_password: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_Registers');
  }
};