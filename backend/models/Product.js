const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  banner: { type: String,  default: 'none' }, 
});

module.exports = mongoose.model("Product", ProductSchema);
