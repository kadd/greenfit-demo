const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();
const USERS_FILE = path.join(__dirname, "../users.json");

// Helper: User laden
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Helper: User speichern
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registrierung
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  let users = loadUsers() || [];
  console.log("Register:", username, email, password);
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ success: false, message: "User existiert bereits" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, email, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ success: true, token });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.username === username);
  

  if (!user) return res.status(401).json({ success: false, message: "Ungültige Anmeldedaten" });

  const valid = await bcrypt.compare(password, user.password);
  console.log(user);
  console.log("Login:", username, password, user && user.password);
  if (!valid) return res.status(401).json({ success: false, message: "Ungültige Anmeldedaten" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ success: true, token });
});

module.exports = router;
