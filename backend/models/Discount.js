const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  percentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model("Discount", DiscountSchema);