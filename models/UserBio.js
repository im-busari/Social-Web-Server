const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserBio extends Model {}
  UserBio.init(
    {
      caption: {
        type: DataTypes.STRING,
        defaultValue: 'Newbie',
      },
      content: {
        type: DataTypes.STRING,
        defaultValue: 'Just joined the network. Looking to meet new people.',
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: 'Bulgaria',
      },
      city: {
        type: DataTypes.STRING,
        defaultValue: 'Varna',
      },
      occupation: {
        type: DataTypes.STRING,
        defaultValue: 'Unemployed',
      },
    },
    {
      sequelize,
      modelName: 'UserBio',
    }
  );
  UserBio.sync()
    .then(() => console.log('UserBio model synced successfully'))
    .catch((err) => console.error(err));
  return UserBio;
};
