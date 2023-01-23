'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users' },
        onDelete: 'cascade',
        hooks: true
      },
      resumeId: {
        type: Sequelize.INTEGER,
        references: { model: 'Resumes' },
        onDelete: 'cascade',
        hooks: true
      },
      coverLetterId: {
        type: Sequelize.INTEGER,
        references: { model: 'CoverLetters' },
        onDelete: 'cascade',
        hooks: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Applications'
    await queryInterface.dropTable('Applications');
  }
};
