// backend/src/services/fileOperations.js
const fs = require('fs').promises;
const path = require('path');
const writeManager = require('./writeManager');
const { backupData } = require('../utils/data');

class FileOperations {
  async readJsonFile(filename) {
    try {
      const filePath = this.getFilePath(filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      throw new Error(`Datei ${filename} konnte nicht gelesen werden`);
    }
  }

  async writeJsonFile(filename, data, options = {}) {
    const { backup = true, validate = true } = options;
    
    return writeManager.acquireWriteLock(filename, async () => {
        console.log(`🔒 Write lock acquired for: ${filename}`);
      try {
        // Optional: Backup erstellen
        if (backup) {
          try {
            await backupData();
            console.log(`✅ Backup created before writing ${filename}`);
          } catch (backupError) {
            console.warn(`⚠️ Backup failed for ${filename}:`, backupError);
          }
        }

        // Optional: Validierung
        if (validate) {
          this.validateData(filename, data);
        }

        // Timestamp hinzufügen
        if (typeof data === 'object' && data !== null) {
          data.updatedAt = new Date().toISOString();
        }

        const filePath = this.getFilePath(filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log(`✅ Successfully wrote ${filename}`);
        return data;
      } catch (error) {
        console.error(`❌ Error writing ${filename}:`, error);
        throw new Error(`Datei ${filename} konnte nicht geschrieben werden: ${error.message}`);
      }
    });
  }

  async updateJsonFile(filename, updateFunction, options = {}) {
  const { backup = true, validate = true } = options;
  
  return writeManager.acquireWriteLock(filename, async () => {
    try {
      console.log(`🔒 Write lock acquired for: ${filename}`);
      
      // Optional: Backup erstellen
      if (backup) {
        try {
          console.log(`Creating backup for: ${filename}`);
          await backupData();
          console.log(`✅ Backup created before writing ${filename}`);
        } catch (backupError) {
          console.warn(`⚠️ Backup failed for ${filename}:`, backupError);
        }
      }

      // Aktuelle Daten lesen
      console.log(`Reading current data for: ${filename}`);
      const currentData = await this.readJsonFile(filename);
      console.log(`Current data loaded for: ${filename}`);
      
      // Update-Funktion anwenden
      console.log(`Applying update function for: ${filename}`);
      const updatedData = updateFunction(currentData);
      console.log(`Update function completed for: ${filename}`);
      
      // Optional: Validierung
      if (validate) {
        console.log(`Validating data for: ${filename}`);
        this.validateData(filename, updatedData);
        console.log(`Validation passed for: ${filename}`);
      }

      // Timestamp hinzufügen
      if (typeof updatedData === 'object' && updatedData !== null) {
        updatedData.updatedAt = new Date().toISOString();
      }

      // ✅ DIREKTES File-Write ohne nested writeJsonFile call:
      const filePath = this.getFilePath(filename);
      console.log(`Writing to file: ${filePath}`);
      await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      
      console.log(`✅ Successfully wrote ${filename}`);
      return updatedData;
      
    } catch (error) {
      console.error(`❌ Error updating ${filename}:`, error);
      throw error;
    }
  });
}

  validateData(filename, data) {
    // Basis-Validierung
    if (data === null || data === undefined) {
      throw new Error(`Ungültige Daten für ${filename}: null/undefined`);
    }

    // Spezifische Validierungen basierend auf Dateiname
    switch (filename) {
      case 'terms.json':
        if (!data.title || !Array.isArray(data.sections)) {
          throw new Error('Terms müssen title und sections Array haben');
        }
        break;
      case 'navigation.json':
        if (!Array.isArray(data.categories)) {
          throw new Error('Navigation muss categories Array haben');
        }
        break;
      case 'header.json':
        if (!data.title) {
          throw new Error('Header muss title haben');
        }
        break;
      // Weitere Validierungen...
    }
  }

  getFilePath(filename) {
    return path.join(__dirname, '../data', filename);
  }

  // Status für Monitoring
  getWriteStatus() {
    return writeManager.getStatus();
  }
}

module.exports = new FileOperations();