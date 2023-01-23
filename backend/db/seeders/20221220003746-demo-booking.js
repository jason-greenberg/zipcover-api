'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings'
    return queryInterface.bulkInsert(options, [
    {
      userId: 1,
      spotId: 1,
      startDate: new Date(2023, 5, 16).toISOString().slice(0,10),
      endDate: new Date(2023, 5, 18).toISOString().slice(0,10)
    },
    {
      userId: 1,
      spotId: 3,
      startDate: new Date(2023, 5, 20).toISOString().slice(0,10),
      endDate: new Date(2023, 5, 22).toISOString().slice(0,10)
    },
    {
      userId: 1,
      spotId: 4,
      startDate: new Date(2023, 5, 24).toISOString().slice(0,10),
      endDate: new Date(2023, 5, 26).toISOString().slice(0,10)
    },
    {
      userId: 2,
      spotId: 2,
      startDate: new Date(2023, 6, 16).toISOString().slice(0,10),
      endDate: new Date(2023, 6, 18).toISOString().slice(0,10)
    },
    {
      userId: 2,
      spotId: 5,
      startDate: new Date(2023, 6, 20).toISOString().slice(0,10),
      endDate: new Date(2023, 6, 22).toISOString().slice(0,10)
    },
    {
      userId: 2,
      spotId: 6,
      startDate: new Date(2023, 6, 24).toISOString().slice(0,10),
      endDate: new Date(2023, 6, 26).toISOString().slice(0,10)
    },
    {
      userId: 3,
      spotId: 1,
      startDate: new Date(2023, 11, 16).toISOString().slice(0,10),
      endDate: new Date(2023, 11, 18).toISOString().slice(0,10)
    },
    {
      userId: 3,
      spotId: 2,
      startDate: new Date(2023, 11, 18).toISOString().slice(0,10),
      endDate: new Date(2023, 11, 20).toISOString().slice(0,10)
    },
    {
      userId: 3,
      spotId: 4,
      startDate: new Date(2023, 11, 22).toISOString().slice(0,10),
      endDate: new Date(2023, 11, 24).toISOString().slice(0,10)
    },
    {
      userId: 2,
      spotId: 5,
      startDate: new Date(2023, 9, 16).toISOString().slice(0,10),
      endDate: new Date(2023, 9, 18).toISOString().slice(0,10)
    },
    {
      userId: 3,
      spotId: 6,
      startDate: new Date(2023, 7, 16).toISOString().slice(0,10),
      endDate: new Date(2023, 9, 11).toISOString().slice(0,10)
    },
    {
      userId: 1,
      spotId: 3,
      startDate: new Date(2023, 5, 28).toISOString().slice(0,10),
      endDate: new Date(2023, 5, 30).toISOString().slice(0,10)
    }
  ], {});
  },
  
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
