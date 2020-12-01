'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.User = Post.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        onDelete: 'CASCADE',
      });
    }
  }
  Post.init(
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );

  Post.sync()
    .then(() => console.log('Post model synced successfully'))
    .catch((err) => console.error(err));

  return Post;
};
