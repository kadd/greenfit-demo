const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ success: false, message: "Kein Token übergeben" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Ungültiger Token" });

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token ungültig" });
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
