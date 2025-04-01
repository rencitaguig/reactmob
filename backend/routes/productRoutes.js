const express = require("express");
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/ProductController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
