const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    // Check token existence and type
    if (!token || typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Fetch user from DB
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = protectRoute;
