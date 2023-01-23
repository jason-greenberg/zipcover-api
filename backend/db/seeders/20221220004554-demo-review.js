'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: "Yo this spot was lit, the basket-weaving classes were the move.",
        stars: 5
      },
      {
        userId: 1,
        spotId: 2,
        review: "Comfy spot, good location",
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: "This crib was so cute and cozy. Definitely would hit it again",
        stars: 5
      },
      {
        userId: 1,
        spotId: 4,
        review: "Had a blast here, the basket-weaving classes were lit",
        stars: 5
      },
      {
        userId: 1,
        spotId: 5,
        review: "This spot was lit, conveniently located and cozy asf",
        stars: 4
      },
      {
        userId: 1,
        spotId: 6,
        review: "Had the best time ever here, the decorations were on point",
        stars: 5
      },
      //
      {
        userId: 2,
        spotId: 1,
        review: "This spot was a vibe, loved the countryside feel",
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: "Loved this place, felt like a part of a magical bunny kingdom",
        stars: 4
      },
      {
        userId: 2,
        spotId: 3,
        review: "Cute and unique asf, highly recommend",
        stars: 5
      },
      {
        userId: 2,
        spotId: 4,
        review: "Loved this spot, perfect for a peaceful getaway",
        stars: 5
      },
      {
        userId: 2,
        spotId: 5,
        review: "This spot was so fun and unique, 10/10 would recommend",
        stars: 4
      },
      {
        userId: 2,
        spotId: 6,
        review: "Had the best time ever, definitely coming back",
        stars: 5
      },
      //
      {
        userId: 3,
        spotId: 1,
        review: "Loved everything about this spot, the decorations were on point",
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: "Such a cozy and peaceful spot, had a great stay",
        stars: 4
      },
      {
        userId: 3,
        spotId: 3,
        review: "This spot was so charming and had a great location",
        stars: 5
      },
      {
        userId: 3,
        spotId: 4,
        review: "Had a great stay here, loved the countryside vibe",
        stars: 5
      },
      {
        userId: 3,
        spotId: 5,
        review: "This place was so cozy and had the best decorations",
        stars: 4
      },
      {
        userId: 3,
        spotId: 6,
        review: 'I loved my stay! I would come back again.',
        stars: 5
      },
  ], {});
},

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
