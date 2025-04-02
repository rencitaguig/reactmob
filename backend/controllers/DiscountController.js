const Discount = require("../models/Discount");

exports.createDiscount = async (req, res) => {
  try {
    const { code, percentage, expiryDate, applicableProducts } = req.body;

    if (!code || !percentage || !expiryDate) {
      return res.status(400).json({ message: "code, percentage, and expiryDate are required." });
    }

    const discount = new Discount({
      code,
      percentage,
      expiryDate,
      applicableProducts
    });
    await discount.save();

    return res.status(201).json(discount);
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().populate('applicableProducts');
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id).populate('applicableProducts');
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.json(discount);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: "Discount deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};