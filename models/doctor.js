'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.hasMany(models.Appointment, { foreignKey: "doctor_id", onDelete: "CASCADE" });
      Doctor.belongsTo(models.Hospital1, { foreignKey: "hospital_id", onDelete: "CASCADE" });

    }
  }
  Doctor.init({
    doctor_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    doctor_email: { // ✅ Add this field
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    doctor_name: DataTypes.STRING,
    specialty: DataTypes.STRING,
    image: DataTypes.TEXT,
    availability: DataTypes.JSON,
    hospital_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};