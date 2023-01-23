'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Hopper Lane',
        city: 'Thumperville',
        state: 'California',
        country: 'United States',
        lat: 36.778259,
        lng: 119.417931,
        name: 'Basket House',
        description: 'Bound to have a good time.',
        price: 199.99,
        previewImage: 'preview-url'
      },
      {
        ownerId: 2,
        address: '456 Jump Street',
        city: 'Bunnyville',
        state: 'New York',
        country: 'United States',
        lat: 40.712775,
        lng: 74.005973,
        name: 'Hare Haven',
        description: 'Cozy and comfortable retreat.',
        price: 149.99,
        previewImage: 'preview-url-2'
      },
      {
        ownerId: 1,
        address: '789 Carrot Avenue',
        city: 'Rabbitville',
        state: 'Texas',
        country: 'United States',
        lat: 32.776664,
        lng: 96.796988,
        name: 'Burrow Bungalow',
        description: 'Relax and recharge in this cute and charming home.',
        price: 174.99,
        previewImage: 'preview-url-3'
      },
      {
        ownerId: 3,
        address: '13 Hopscotch Road',
        city: 'Lapin Town',
        state: 'Montana',
        country: 'United States',
        lat: 46.879682,
        lng: 110.362566,
        name: 'Rabbit Retreat',
        description: 'Escape to the peacefulness of the countryside.',
        price: 129.99,
        previewImage: 'preview-url-4'
      },
      {
        ownerId: 2,
        address: '57 Bunny Lane',
        city: 'Bounce City',
        state: 'Florida',
        country: 'United States',
        lat: 30.267153,
        lng: -97.743061,
        name: 'Rabbits Lair',
        description: 'Feel like a part of the magical kingdom of bunnies',
        price: 199.99,
        previewImage: 'preview-url-5'
      },
      {
        ownerId: 1,
        address: '341 Rabbit Run',
        city: 'Leap Town',
        state: 'New Jersey',
        country: 'United States',
        lat: 40.058324,
        lng: -74.405661,
        name: 'Bunny Bungalow',
        description: 'A unique and adorable home',
        price: 149.99,
        previewImage: 'preview-url-6'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Hopper Lane', '456 Jump Street', '789 Carrot Avenue'] }
    }, {});
  }
};
