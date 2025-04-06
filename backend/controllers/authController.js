const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ 
      name, 
      email, 
      password,
      profileImage // Store base64 image string directly
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    // Update user's pushToken when logging in
    await User.findByIdAndUpdate(user._id, { pushToken: token });

    console.log("Generated token:", token); // Debugging: log the generated token
    console.log("Updated user pushToken"); // Debugging: confirm pushToken update

    res.json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    await User.findByIdAndUpdate(userId, { pushToken: null });
    console.log('PushToken cleared for user:', userId);

    res.json({ 
      message: "Logged out successfully",
      clearToken: true 
    });

  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    const userId = req.user.userId; // From auth middleware

    const updateData = { name, email };
    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

