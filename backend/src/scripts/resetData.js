// backend/src/scripts/resetData.js

const DefaultGenerator = require('../services/defaultGenerator');
const fs = require('fs').promises;
const path = require('path');

async function resetData(target = 'all') {
  const dataDir = path.join(__dirname, '../data');
  
  console.log(`🔄 Resetting ${target === 'all' ? 'all data' : target}...`);
  
  try {
    const fileMap = {
      'blog': 'blog.json',
      'faq': 'faq.json', 
      'privacy': 'privacy.json',
      'terms': 'terms.json'
    };
    
    const generatorMap = {
      'blog': () => DefaultGenerator.generateBlog(),
      'faq': () => DefaultGenerator.generateFAQ(),
      'privacy': () => DefaultGenerator.generatePrivacy(),
      'terms': () => DefaultGenerator.generateTerms()
    };

    if (target === 'all') {
      // Alle Dateien zurücksetzen
      for (const [key, filename] of Object.entries(fileMap)) {
        const filePath = path.join(dataDir, filename);
        const data = generatorMap[key]();
        
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Reset ${filename}`);
      }
    } else {
      // Einzelne Datei zurücksetzen
      if (!fileMap[target]) {
        console.error(`❌ Unknown target: ${target}`);
        console.log('Available targets: all, blog, faq, privacy, terms');
        process.exit(1);
      }
      
      const filename = fileMap[target];
      const filePath = path.join(dataDir, filename);
      const data = generatorMap[target]();
      
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Reset ${filename}`);
    }
    
    console.log('🎉 Reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during reset:', error);
    process.exit(1);
  }
}

// Command line interface
const target = process.argv[2] || 'all';
resetData(target);