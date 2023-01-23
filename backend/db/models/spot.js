'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(
        models.Booking,
        { foreignKey: 'spotId' }
      ),
      Spot.belongsToMany(
        models.User,
        { through: models.Booking, foreignKey: 'spotId' }
      ),
      Spot.belongsToMany(
        models.User,
        { through: models.Review, foreignKey: 'spotId' }
      ),
      Spot.hasMany(
        models.SpotImage,
        { foreignKey: 'spotId', onDelete: 'cascade', hooks: true }
      ),
      Spot.belongsTo(
        models.User,
        { foreignKey: 'ownerId' }
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Address must be a string');
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('City must be a string');
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('State must be a string');
          }
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Country must be a string');
          }
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Name must be a string');
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Description must be a string');
          }
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {}
    },
    scopes: {
      bookingView: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    }
  });
  return Spot;
};
