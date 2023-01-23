'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'image-url-1',
        preview: true
      },
      {
        spotId: 1,
        url: 'image-url-2',
        preview: false
      },
      {
        spotId: 1,
        url: 'image-url-3',
        preview: true
      },
      {
        spotId: 1,
        url: 'image-url-4',
        preview: false
      },
      {
        spotId: 2,
        url: 'image-url-5',
        preview: true
      },
      {
        spotId: 2,
        url: 'image-url-6',
        preview: false
      },
      {
        spotId: 2,
        url: 'image-url-7',
        preview: true
      },
      {
        spotId: 2,
        url: 'image-url-8',
        preview: false
      },
      {
        spotId: 3,
        url: 'image-url-9',
        preview: true
      },
      {
        spotId: 3,
        url: 'image-url-10',
        preview: false
      },
      {
        spotId: 3,
        url: 'image-url-11',
        preview: true
      },
      {
        spotId: 3,
        url: 'image-url-12',
        preview: false
      },
      {
        spotId: 4,
        url: 'image-url-13',
        preview: true
      },
      {
        spotId: 4,
        url: 'image-url-14',
        preview: false
      },
      {
        spotId: 5,
        url: 'image-url-15',
        preview: true
      },
      {
        spotId: 5,
        url: 'image-url-16',
        preview: false
      },
      {
        spotId: 5,
        url: 'image-url-17',
        preview: true
      },
      {
        spotId: 6,
        url: 'image-url-18',
        preview: false
      },
      {
        spotId: 6,
        url: 'image-url-19',
        preview: true
      },
      {
        spotId: 6,
        url: 'image-url-20',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
