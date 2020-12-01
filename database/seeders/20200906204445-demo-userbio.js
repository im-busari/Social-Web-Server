'use strict';

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert(
      'UserBios',
      [
        {
          caption: 'This girl is admin',
          content: "Don't touch it",
          dateOfBirth: new Date(),
          country: 'example@example.com',
          city: 'Dobrich',
          occupation: 'Software Developer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: 'Loves Cooking',
          content: 'Lasagna and food',
          dateOfBirth: new Date(),
          country: 'example@example.com',
          city: 'Varna',
          occupation: 'Swimmer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          caption: 'Just a newbie user',
          content: "Don't touch it",
          dateOfBirth: new Date(),
          country: 'example@example.com',
          city: 'Dobrich',
          occupation: 'DingDong',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('UserBios', null, {});
  },
};
