'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoverLetter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CoverLetter.init({
    userId: DataTypes.INTEGER,
    resumeId: DataTypes.INTEGER,
    letterText: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    engine: DataTypes.STRING,
    jobDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CoverLetter',
  });
  return CoverLetter;
};