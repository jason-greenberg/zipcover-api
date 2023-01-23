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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resumeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    letterText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    engine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CoverLetter',
  });
  return CoverLetter;
};
