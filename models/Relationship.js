'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    static associate(models) {
      Relationship.belongsTo(models.User, {
        as: 'follower',
        foreignKey: 'follower_id',
      });
      Relationship.belongsTo(models.User, {
        as: 'followed',
        foreignKey: 'followed_id',
      });
    }
  }
  Relationship.init(
    {
      follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Relationship',
    }
  );

  Relationship.sync()
    .then(() => console.log('Relationship model synced successfully'))
    .catch((err) => console.error(err));

  return Relationship;
};
