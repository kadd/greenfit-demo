// POST /api/contact
exports.submitContact = (req, res) => {
  const { name, email, message } = req.body;

  console.log("📩 Neue Kontaktanfrage:", { name, email, message });

  res.json({ success: true, msg: "Nachricht erhalten! Vielen Dank 🙌" });
};
