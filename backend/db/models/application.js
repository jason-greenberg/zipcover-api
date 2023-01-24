'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Application.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      )
    }
  }
  Application.init({
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users' },
      onDelete: 'cascade',
      hooks: true
    },
    resumeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Resumes' },
      onDelete: 'cascade',
      hooks: true
    },
    coverLetterId: {
      type: DataTypes.INTEGER,
      references: { model: 'CoverLetters' },
      onDelete: 'cascade',
      hooks: true
    },
  }, {
    sequelize,
    modelName: 'Application',
  });
  return Application;
};
