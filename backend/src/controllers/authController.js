const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Dummy-User (später DB)
  if (username === "admin" && password === "geheim") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  }

  res.status(401).json({ success: false, msg: "Ungültige Login-Daten" });
};
