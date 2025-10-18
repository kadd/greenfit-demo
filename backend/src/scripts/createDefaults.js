// backend/src/scripts/createDefaults.js

const DefaultGenerator = require('../services/defaultGenerator');
const path = require('path');

async function createDefaults() {
  const dataDir = path.join(__dirname, '../data');
  
  console.log('🔧 Creating default data files...');
  
  try {
    await DefaultGenerator.generateAllDefaults(dataDir);
    console.log('✅ Default files created successfully!');
  } catch (error) {
    console.error('❌ Error creating defaults:', error);
    process.exit(1);
  }
}

// Script direkt ausführen wenn aufgerufen
if (require.main === module) {
  createDefaults();
}

module.exports = createDefaults;