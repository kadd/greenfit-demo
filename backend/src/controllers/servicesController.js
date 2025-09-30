const path = require("path");
const fs = require("fs");

exports.getServices = (req, res) => {
  const filePath = path.join(__dirname, "../data/services.json");
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    const services = JSON.parse(rawData);
    return res.json(services);
  }
  return res.status(404).json({ message: "services.json not found" });
};