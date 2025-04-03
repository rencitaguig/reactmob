const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, banner } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "name, price, and category are required." });
    }

    // Check image size if present
    if (image && image.length > 5 * 1024 * 1024) { // 5MB limit for base64 images
      return res.status(413).json({ message: "Image size too large. Please use an image under 5MB." });
    }

    const product = new Product({ 
      name, 
      description, 
      price, 
      category, 
      image,
      banner: banner || 'none'
    });
    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
