const express = require("express");
const { register, login, logout, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
