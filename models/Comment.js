'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
        onDelete: 'SET NULL',
      });
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Comment.init(
    {
      content: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );

  Comment.sync()
    .then(() => console.log('Comment model synced successfully'))
    .catch((err) => console.error(err));
  return Comment;
};
