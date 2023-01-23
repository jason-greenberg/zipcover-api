'use strict';
const {
  Model,
  Op,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      )
    }
  }
  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users' },
      onDelete: 'cascade',
      hooks: true
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: 'Spots' },
      onDelete: 'cascade',
      hooks: true
    },
    SpotId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      }
  }, {
    sequelize,
    modelName: 'Booking',      
  });
  return Booking;
};
