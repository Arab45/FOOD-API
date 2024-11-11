const mongoose = require('mongoose');
const Schema = mongoose.Schema

const menuSchema = new Schema({
    item_name: {
      type: String,
      required: true,
    },
    item_description: {
      type: String,
      required: true,
    },
    item_category: {
      type: String,
      required: true,
    },
    item_quantity: {
      type: String,
      required: true,
    },
    item_price: {
      type: Number,
      required: true,
    },
    item_image: {
      type: String,
      required: true,
    },
    added_by: {
      type: String,
      required: true,
    },
    updated_by: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

module.exports = mongoose.model('Menu', menuSchema);