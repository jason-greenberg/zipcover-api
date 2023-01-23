'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(
        models.ReviewImage,
        { foreignKey: 'reviewId', onDelete: 'cascade', hooks: true }
      );        
    }       
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users' },
      onDelete: 'cascade'
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spots' },
      onDelete: 'cascade'
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: {
        args: false,
        msg: 'Review text is required'
      },
      validate: {
        notEmpty: {
          msg: 'Review text is required'
        },
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Review must be a string');
          }
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Stars must be an integer from 1 to 5'
      },
      validate: {
        isInt: {
          msg: 'Stars must be an integer'
        },
        isIn: {
          args: [[1, 2, 3, 4, 5]],
          msg: 'Stars must be an integer from 1 to 5'
        }
      }
    }    
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {},
    scopes: {
      createReview: {
        attributes: {
          include: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
        }
      }
    }
  });
  return Review;
};
