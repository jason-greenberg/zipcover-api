'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      )
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spots'}
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Image URL must be a string');
          }
        }
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      validate: {
        isBoolean(value) {
          if (typeof value !== 'boolean') {
            throw new Error('Preview value must be a boolean');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'spotId']
      }
    },
    scopes: {
      spotImageView: {
        attributes: {
          include: ['spotId', 'url', 'preview']
        }
      }
    }
  });
  return SpotImage;
};
