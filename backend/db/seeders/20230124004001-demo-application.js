'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Applications';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        resumeId: 1,
        coverLetterId: 1
      },
      {
        userId: 2,
        resumeId: 2,
        coverLetterId: 2
      },
      {
        userId: 3,
        resumeId: 3,
        coverLetterId: 3
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Applications';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
