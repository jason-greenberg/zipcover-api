'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Resume.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      );
      Resume.belongsToMany(
        models.CoverLetter,
        { through: models.Application, foreignKey: 'resumeId', otherKey: 'coverLetterId' }
      )
    }
  }
  Resume.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users' },
      onDelete: 'cascade',
      hooks: true
    },
    resumeText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    positionType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skillLevel: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Resume',
  });
  return Resume;
};
