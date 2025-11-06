'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
      doctor_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctor_name: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      image: {
        type: Sequelize.TEXT,
        allowNull: false,

      },
      availability: {
        type: Sequelize.JSON
      },
      hospital_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Doctors');
  }
};