🚀 Verwendung der Scripts:

📋 Tägliche Verwendung:
# Nur fehlende Defaults erstellen:
npm run create-defaults

# Komplettes Reset aller Daten:
npm run reset-data

# Einzelne Bereiche zurücksetzen:
npm run reset-blog
npm run reset-faq
npm run reset-privacy
npm run reset-terms


🔒 Backup & Restore:
# Backup vor wichtigen Änderungen:
npm run backup-data

# Alle verfügbaren Backups anzeigen:
npm run restore-data

# Neuestes Backup wiederherstellen:
npm run restore-data latest

# Spezifisches Backup wiederherstellen:
npm run restore-data backup-2024-10-18T15-30-00-000Z


🛠️ Development Workflow:
# 1. Backup erstellen vor Experimenten:
npm run backup-data

# 2. Mit Test-Daten experimentieren:
npm run reset-faq    # FAQ mit Default-Daten füllen

# 3. Bei Problemen zurück zum Backup:
npm run restore-data latest

# 4. Komplett sauberer Start:
npm run reset-data


🎯 Vorteile dieser Lösung:
✅ Flexible Reset-Optionen (all/einzeln)
✅ Automatische Backups vor Reset
✅ Backup-History (letzte 10 Backups)
✅ Einfache CLI-Commands
✅ Safety-First (immer Backup vor Restore)
✅ Development-friendly
✅ Production-ready

backend/src/
├── data/
│   ├── blog.json
│   ├── faq.json
│   ├── privacy.json
│   ├── terms.json
│   └── backups/
│       ├── backup-2024-10-18T15-30-00-000Z/
│       ├── backup-2024-10-18T16-45-00-000Z/
│       └── ...
├── services/
│   └── defaultGenerator.js     ← Ihr bestehender Code
└── scripts/
    ├── createDefaults.js
    ├── resetData.js
    ├── backupData.js
    └── restoreData.js
