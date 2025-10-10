function loadHeader() {
const data = require("../data/header.json");
   return data;
}

function saveHeader(newHeader) {
  const fs = require("fs");
  const path = require("path");
  const filePath = path.join(__dirname, "../data/header.json");

  fs.writeFileSync(filePath, JSON.stringify(newHeader, null, 2), "utf-8");
}

module.exports = { loadHeader, saveHeader };
