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
      CoverLetter.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      );
      CoverLetter.belongsToMany(
        models.Resume,
        { through: models.Application, foreignKey: 'coverLetterId', otherKey: 'resumeId' }
      )
    }
  }
  CoverLetter.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users' },
      onDelete: 'cascade',
      hooks: true
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
