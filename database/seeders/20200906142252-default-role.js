'use strict';

module.exports = {
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'Admin',
          description:
            'The admin has access to all posts and comments on the network and is allowed to delete them whenever.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'User',
          description: 'Can react, comment and post.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    return await queryInterface.bulkDelete('Roles', null, {});
  },
};
