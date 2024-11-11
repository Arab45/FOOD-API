const mongoose = require('mongoose');
const Schema = mongoose.Schema



const placeOrderSchema = new Schema({
    owner: {
      type: String,
      required: true
    },
    order_title: {
      type: String,
      required: true,
    },
    orders: [
      {
        item_id: {
          type: String,
          required: true
        },
        item_name: {
          type: String,
          required: true,
        },
        item_price: {
          type: String,
          required: true,
        },
        item_quantity: {
          type: String,
          required: true,
        },
      },
    ],
    order_total_price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

module.exports = mongoose.model('Order', placeOrderSchema);