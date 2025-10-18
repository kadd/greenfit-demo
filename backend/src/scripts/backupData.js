// backend/src/scripts/backupData.js

const fs = require('fs').promises;
const path = require('path');

async function backupData() {
  const dataDir = path.join(__dirname, '../data');
  const backupDir = path.join(dataDir, 'backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  
  console.log('📦 Creating data backup...');
  
  try {
    // Backup Ordner erstellen
    await fs.mkdir(backupDir, { recursive: true });
    await fs.mkdir(backupPath, { recursive: true });
    
    // Alle JSON Dateien kopieren
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    for (const file of jsonFiles) {
      const sourcePath = path.join(dataDir, file);
      const targetPath = path.join(backupPath, file);
      
      await fs.copyFile(sourcePath, targetPath);
      console.log(`✅ Backed up ${file}`);
    }
    
    // Backup Info erstellen
    const backupInfo = {
      timestamp: new Date().toISOString(),
      files: jsonFiles,
      version: process.env.npm_package_version || '1.0.0'
    };
    
    await fs.writeFile(
      path.join(backupPath, 'backup-info.json'),
      JSON.stringify(backupInfo, null, 2)
    );
    
    console.log(`🎉 Backup created: ${backupPath}`);
    
    // Alte Backups löschen (nur die letzten 10 behalten)
    await cleanupOldBackups(backupDir);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

async function cleanupOldBackups(backupDir) {
  try {
    const backups = await fs.readdir(backupDir);
    const backupDirs = backups.filter(dir => dir.startsWith('backup-'));
    
    if (backupDirs.length > 10) {
      // Nach Datum sortieren (älteste zuerst)
      backupDirs.sort();
      
      // Älteste löschen
      const toDelete = backupDirs.slice(0, backupDirs.length - 10);
      
      for (const dir of toDelete) {
        const dirPath = path.join(backupDir, dir);
        await fs.rm(dirPath, { recursive: true });
        console.log(`🗑️  Deleted old backup: ${dir}`);
      }
    }
  } catch (error) {
    console.warn('⚠️  Cleanup warning:', error.message);
  }
}

backupData();