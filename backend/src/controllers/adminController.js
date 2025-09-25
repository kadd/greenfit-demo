require('dotenv').config();

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    res.json({ success: true, message: 'Login erfolgreich' });
  } else {
    res.status(401).json({ success: false, message: 'Ungültige Zugangsdaten' });
  }
};
