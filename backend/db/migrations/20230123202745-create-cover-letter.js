'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoverLetters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users' },
        onDelete: 'cascade',
        hooks: true
      },
      resumeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      letterText: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      engine: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jobDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "CoverLetters"
    await queryInterface.dropTable('CoverLetters');
  }
};
