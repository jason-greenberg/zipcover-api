'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Resumes';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        resumeText: 'Google | Fullstack Web Developer. Maintained entire web search. Backend, frontend experience.',
        positionType: 'Fullstack Software Engineer',
        skillLevel: 'Entry',
      },
      {
        userId: 2,
        resumeText: 'LinkedIn | Backend Web Developer. Built entire LinkedIn API. Streamlined query efficiency on Instagram for 11 years.',
        positionType: 'Backend Software Engineer',
        skillLevel: 'Senior',
      },
      {
        userId: 3,
        resumeText: 'Vayner Media | Team Lead, Marketing. Designed a guerilla marketing campaign for Coca-Cola in the Superbowl. 150k on TikTok. Brand Ambassador Skims.',
        positionType: 'Marketing Associate',
        skillLevel: 'Mid',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Resumes';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
