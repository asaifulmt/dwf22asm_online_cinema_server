'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userFilm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, film }) {
      // define association here
      this.belongsTo(user)
      this.belongsTo(film)
    }
  };
  userFilm.init({
    userId: DataTypes.INTEGER,
    filmId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    accountNumber: DataTypes.BIGINT,
    transferProof: DataTypes.STRING,
    orderDate: DataTypes.STRING,
    rate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userFilm',
  });
  return userFilm;
};
