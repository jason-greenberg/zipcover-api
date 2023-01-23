'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImage.belongsTo(
        models.Review,
        { foreignKey: 'reviewId', onDelete: 'cascade', hooks: true }
      )
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      references: { model: 'Reviews', onDelete: 'cascade', hooks: true },
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        notEmpty: {
          msg: 'url text is required'
        },
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Url must be a string');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
    defaultScope: {},
    scopes: {
      getReviewsView: {
        attributes: {
          include: ['id', 'url'],
          exclude: ['reviewId', 'createdAt', 'updatedAt']
        }
      }
    }
  });
  return ReviewImage;
};
