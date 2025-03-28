const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", ""); // Remove "Bearer " prefix
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId }; // Ensure userId is included in req.user
    next();
  } catch (error) {
    console.error("Invalid token:", error.message); // Debugging: log the error message
    res.status(401).json({ message: "Invalid token" });
  }
};
