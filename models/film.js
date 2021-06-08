'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, category, userFilm }) {
      // define association here
      this.belongsTo(category)
      this.belongsToMany(user, { through: userFilm })
    }
  };
  film.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    filmUrl: DataTypes.STRING,
    price: DataTypes.BIGINT,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'film',
  });
  return film;
};
