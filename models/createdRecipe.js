'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class createdRecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.createdRecipe.belongsTo(models.user)
    }
  };
  createdRecipe.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    directions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'createdRecipe',
  });
  return createdRecipe;
};