const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "name, price, and category are required." });
    }

    let imageUrl = null;
    if (req.file) {
      // Wrap cloudinary upload_stream in a promise to wait for the upload to finish
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Error uploading image to Cloudinary:", error);
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    const product = new Product({ name, description, price, category, image: imageUrl });
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
