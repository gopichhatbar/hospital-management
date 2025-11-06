'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Doctor, { foreignKey: "doctor_id", onDelete: "CASCADE" });

    }
  }
  Appointment.init({
    appointment_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    appointmentDate: DataTypes.DATEONLY,
    appointmentTime: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ["Pending", "Accepted", "Rejected"], // ✅ Correct way to define ENUM
      defaultValue: "Pending",
  },
    doctor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};