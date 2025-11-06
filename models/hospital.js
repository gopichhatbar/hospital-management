'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hospital.hasMany(models.Doctor, { foreignKey: "hospital_id", onDelete: "CASCADE" });

    }
  }
  Hospital.init({
    hospital_id: {
      autoIncrement: true,
      primaryKey: true, 
      type: DataTypes.INTEGER,
    },
    hospital_name: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hospital',
  });
  return Hospital;
};