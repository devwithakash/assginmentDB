const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 VERY IMPORTANT
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
