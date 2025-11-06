'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {

      appointment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      appointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,

      },
      appointmentTime: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      status: {
        type: Sequelize.ENUM("Pending", "Accepted", "Rejected"),
        defaultValue: "Pending",
        allowNull: false,
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Doctors", // Make sure "Doctors" is the correct table name
          key: "doctor_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable('Appointments');
  }
};