'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Product, {as: 'items', through: {model: models.OrderItem}, foreignKey: 'order_id'})
      // define association here
    }
  }
  Order.init({
    user_id: DataTypes.BIGINT,
    total_quantity: DataTypes.DECIMAL,
    total_price: DataTypes.DECIMAL,
    status: DataTypes.ENUM('pending','success'),
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  });
  return Order;
};