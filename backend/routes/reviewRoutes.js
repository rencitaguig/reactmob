const express = require("express");
const { createReview, getReviews, getReview, updateReview, deleteReview } = require("../controllers/ReviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/", getReviews);
router.get("/:id", getReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
