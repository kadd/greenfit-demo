const fs = require("fs");
const path = require("path");

// Pfad zur teams.json Datei
// const teamsPath = path.join(__dirname, "../data/teams.json"); --- IGNORE ---

// Hilfsfunktionen

function loadTeams() {
    const dataPath = path.join(__dirname, "../data/teams.json");
    if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath);
        return JSON.parse(rawData);
    }
    return [];
}

function saveTeams(teams) {
    const dataPath = path.join(__dirname, "../data/teams.json");
    fs.writeFileSync(dataPath, JSON.stringify(teams, null, 2));
}

module.exports = { loadTeams, saveTeams };