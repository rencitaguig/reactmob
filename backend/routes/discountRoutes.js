const express = require("express");
const { createDiscount, getDiscounts, getDiscount, updateDiscount, deleteDiscount } = require("../controllers/DiscountController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDiscount);
router.get("/", getDiscounts);
router.get("/:id", getDiscount);
router.put("/:id", authMiddleware, updateDiscount);
router.delete("/:id", authMiddleware, deleteDiscount);

module.exports = router;