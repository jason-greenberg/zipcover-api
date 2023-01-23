'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'review-image-1.jpg'
      },
      {
        reviewId: 1,
        url: 'review-image-2.jpg'
      },
      {
        reviewId: 2,
        url: 'review-image-3.jpg'
      },
      {
        reviewId: 3,
        url: 'review-image-4.jpg'
      },
      {
        reviewId: 3,
        url: 'review-image-5.jpg'
      },
      {
        reviewId: 4,
        url: 'review-image-6.jpg'
      },
      {
        reviewId: 4,
        url: 'review-image-7.jpg'
      },
      {
        reviewId: 4,
        url: 'review-image-8.jpg'
      },
      {
        reviewId: 5,
        url: 'review-image-9.jpg'
      },
      {
        reviewId: 5,
        url: 'review-image-10.jpg'
      },
      {
        reviewId: 6,
        url: 'review-image-11.jpg'
      },
      {
      reviewId: 7,
      url: 'review-image-12.jpg'
      },
      {
      reviewId: 7,
      url: 'review-image-13.jpg'
      },
      {
      reviewId: 8,
      url: 'review-image-14.jpg'
      },
      {
      reviewId: 8,
      url: 'review-image-15.jpg'
      },
      {
      reviewId: 9,
      url: 'review-image-16.jpg'
      },
      {
      reviewId: 9,
      url: 'review-image-17.jpg'
      },
      {
      reviewId: 10,
      url: 'review-image-18.jpg'
      },
      {
      reviewId: 10,
      url: 'review-image-19.jpg'
      },
      {
      reviewId: 11,
      url: 'review-image-20.jpg'
      },
      {
      reviewId: 11,
      url: 'review-image-21.jpg'
      },
      {
      reviewId: 12,
      url: 'review-image-22.jpg'
      },
      {
      reviewId: 12,
      url: 'review-image-23.jpg'
      },
      {
      reviewId: 13,
      url: 'review-image-24.jpg'
      },
      {
      reviewId: 13,
      url: 'review-image-25.jpg'
      },
      {
      reviewId: 14,
      url: 'review-image-26.jpg'
      },
      {
      reviewId: 14,
      url: 'review-image-27.jpg'
      },
      {
      reviewId: 15,
      url: 'review-image-28.jpg'
      },
      {
      reviewId: 15,
      url: 'review-image-29.jpg'
      },
      {
      reviewId: 16,
      url: 'review-image-30.jpg'
      },
      {
      reviewId: 16,
      url: 'review-image-31.jpg'
      },
      {
      reviewId: 17,
      url: 'review-image-32.jpg'
      },
      {
      reviewId: 17,
      url: 'review-image-33.jpg'
      },
      {
      reviewId: 18,
      url: 'review-image-34.jpg'
      },
      {
      reviewId: 18,
      url: 'review-image-35.jpg'
      }
    ], {});
  },
  
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] }
    }, {});
  }
};
