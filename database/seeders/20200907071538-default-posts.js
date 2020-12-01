'use strict';

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert('Posts', [
      {
        userId: 1,
        title: 'Unique First Post',
        content: "Hooray.... Don't know what to do",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: 'Ding Dong',
        content: "Hooray.... Don't know what to do",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'Cooking is my passion',
        content: "Let's talk about food",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'Second User is quite active',
        content: 'Random random water...',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: "Let's talk about sarmi",
        content: 'Grandma is best!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        title: 'Pineapple, pear, apple...',
        content: 'Are you a vegetarian or what...',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        title: 'Music is...',
        content: 'Music',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Posts', null, {});
  },
};
