# Im Backend-Verzeichnis
node -e "
const { backupData } = require('./src/utils/data.js');
backupData()
  .then(path => console.log('Backup erfolgreich:', path))
  .catch(err => console.error('Backup fehlgeschlagen:', err));
"