const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate star rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars." });
    }

    if (userId !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to create a review for this user" });
    }

    const newReview = new Review({ userId, productId, rating, comment });
    await newReview.save();

    const populatedReview = await Review.findById(newReview._id)
      .populate("userId", "name")
      .populate("productId", "name");

    res.status(201).json({ 
      message: "Review created successfully", 
      review: populatedReview 
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name _id") // Add _id to populated fields
      .populate("productId", "name");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("userId", "name").populate("productId", "name");
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the logged-in user owns this review
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("userId", "name _id")
      .populate("productId", "name");

    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the logged-in user owns this review
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate("userId", "name _id") // Make sure to populate user ID
      .populate("productId", "name");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
