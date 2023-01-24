'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'CoverLetters';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        letterText: 'Dear Hiring Manager, This is a sample Cover Letter. Sincerely, Demo',
        rating: 5,
        engine: 'text-ada-001',
        jobDescription: 'Fullstack Web Developer. 10 Years Node.js exp. API, SQL, AWS, Azure.'
      },
      {
        userId: 2,
        letterText: 'Dear Hiring Manager, This is a sample Cover Letter. Sincerely, Fake',
        rating: 4,
        engine: 'text-ada-001',
        jobDescription: 'Taco Chef. 50 Years of exp behind a line. Fast-paced env. We are a family here.'
      },
      {
        userId: 3,
        letterText: 'Dear Hiring Manager, This is a sample Cover Letter. Sincerely, Fake2',
        rating: 5,
        engine: 'text-ada-001',
        jobDescription: 'Junior Marketing Associate. 5 years of experience preffered. Business major, comms. Bachelor degree. Creativity is a must. Work hard play hard.'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'CoverLetters';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
