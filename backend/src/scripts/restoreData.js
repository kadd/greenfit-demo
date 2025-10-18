// backend/src/scripts/restoreData.js

const fs = require('fs').promises;
const path = require('path');

async function listBackups() {
  const backupDir = path.join(__dirname, '../data/backups');
  
  try {
    const backups = await fs.readdir(backupDir);
    const backupDirs = backups.filter(dir => dir.startsWith('backup-')).sort().reverse();
    
    console.log('📦 Available backups:');
    console.log('');
    
    for (let i = 0; i < backupDirs.length; i++) {
      const backupPath = path.join(backupDir, backupDirs[i]);
      const infoPath = path.join(backupPath, 'backup-info.json');
      
      try {
        const info = JSON.parse(await fs.readFile(infoPath, 'utf8'));
        const date = new Date(info.timestamp).toLocaleString('de-DE');
        
        console.log(`${i + 1}. ${backupDirs[i]}`);
        console.log(`   Date: ${date}`);
        console.log(`   Files: ${info.files.join(', ')}`);
        console.log('');
      } catch {
        console.log(`${i + 1}. ${backupDirs[i]} (no info available)`);
        console.log('');
      }
    }
    
    return backupDirs;
  } catch (error) {
    console.error('❌ No backups found or error:', error.message);
    return [];
  }
}

async function restoreData(backupName) {
  const dataDir = path.join(__dirname, '../data');
  const backupDir = path.join(dataDir, 'backups');
  const backupPath = path.join(backupDir, backupName);
  
  console.log(`🔄 Restoring from backup: ${backupName}...`);
  
  try {
    // Prüfen ob Backup existiert
    await fs.access(backupPath);
    
    // Aktuellen Zustand sichern
    console.log('📦 Creating safety backup...');
    const { execSync } = require('child_process');
    execSync('npm run backup-data', { cwd: path.join(__dirname, '..') });
    
    // Backup-Dateien kopieren
    const files = await fs.readdir(backupPath);
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'backup-info.json');
    
    for (const file of jsonFiles) {
      const sourcePath = path.join(backupPath, file);
      const targetPath = path.join(dataDir, file);
      
      await fs.copyFile(sourcePath, targetPath);
      console.log(`✅ Restored ${file}`);
    }
    
    console.log('🎉 Restore completed successfully!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

// Command line interface
async function main() {
  const backupName = process.argv[2];
  
  if (!backupName) {
    console.log('🔄 Data Restore Tool');
    console.log('');
    console.log('Usage: npm run restore-data <backup-name>');
    console.log('   or: npm run restore-data latest');
    console.log('');
    
    const backups = await listBackups();
    
    if (backups.length > 0) {
      console.log('To restore the latest backup:');
      console.log(`npm run restore-data ${backups[0]}`);
    }
    
    return;
  }
  
  if (backupName === 'latest') {
    const backupDir = path.join(__dirname, '../data/backups');
    const backups = await fs.readdir(backupDir);
    const latest = backups.filter(dir => dir.startsWith('backup-')).sort().reverse()[0];
    
    if (latest) {
      await restoreData(latest);
    } else {
      console.error('❌ No backups found');
    }
  } else {
    await restoreData(backupName);
  }
}

main();