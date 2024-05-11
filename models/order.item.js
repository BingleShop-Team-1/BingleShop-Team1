'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {

        static associate(models) {

        }
    }
    OrderItem.init({
        order_id: DataTypes.INTEGER,
        item_id: DataTypes.INTEGER,
        quantity: DataTypes.DECIMAL
      }, {
        sequelize,
        modelName: 'OrderItem',
      });
      return OrderItem;
}