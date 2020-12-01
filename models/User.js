const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.UserBio = User.belongsTo(models.UserBio, {
        foreignKey: 'bioId',
      });
      this.Role = User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
      });
      this.Relationship = User.hasMany(models.Relationship, {
        as: 'active_relationships',
        foreignKey: 'follower_id',
        onDelete: 'cascade',
        hooks: true,
      });
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });

      User.belongsToMany(User, {
        as: 'following',
        through: 'Relationships',
        foreignKey: 'follower_id',
        onDelete: 'cascade',
      });
      User.belongsToMany(User, {
        as: 'followers',
        through: 'Relationships',
        foreignKey: 'followed_id',
        onDelete: 'cascade',
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          isAlpha: true,
          len: {
            args: [3, 50],
            msg: 'Please, mind the allowed min and max number of characters.',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          notNull: true,
          notEmpty: true,
          len: {
            args: [3, 50],
            msg: 'Please, mind the allowed min and max number of characters.',
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
          notEmpty: true,
          notNull: {
            msg:
              'Please, give us a unique username. You will need it to login later.',
          },
          len: {
            args: [5, 50],
            msg: 'Please, mind the allowed min and max number of characters.',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: {
            msg: 'Please, provide your email address.',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        },
        validate: {
          //  TODO: Add RegExp
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set() {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.sync()
    .then(() => console.log('User model synced successfully'))
    .catch((err) => console.error(err));
  return User;
};
