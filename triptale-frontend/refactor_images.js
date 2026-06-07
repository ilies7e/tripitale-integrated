const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.expo') && !filePath.includes('.git')) {
      results = results.concat(walk(filePath));
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(__dirname);

files.forEach(file => {
  if (file.endsWith('refactor_images.js')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Find imports from react-native
  const rnImportRegex = /import\s+{([^}]*?)}\s+from\s+['"]react-native['"];/g;
  let hasExpoImages = false;
  
  content = content.replace(rnImportRegex, (match, imports) => {
    const parts = imports.split(',').map(s => s.trim());
    const rnParts = parts.filter(p => p && p !== 'Image' && p !== 'ImageBackground');
    const expoParts = parts.filter(p => p === 'Image' || p === 'ImageBackground');
    
    if (expoParts.length > 0) {
      hasExpoImages = true;
      let newImport = '';
      if (rnParts.length > 0) {
        // keep the rest in react-native
        newImport += `import { ${rnParts.join(', ')} } from 'react-native';\n`;
      }
      newImport += `import { ${expoParts.join(', ')} } from 'expo-image';`;
      return newImport;
    }
    return match;
  });
  
  if (hasExpoImages) {
    // Replace resizeMode with contentFit for expo-image compatibility
    content = content.replace(/resizeMode=/g, 'contentFit=');
    fs.writeFileSync(file, content, 'utf8');
    console.log('✅ Updated:', path.relative(__dirname, file));
  }
});

console.log('✨ All files refactored successfully!');
