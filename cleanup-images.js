const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/properties.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all image: '...' with image: ''
content = content.replace(/image:\s*'[^']*'/g, "image: ''");

fs.writeFileSync(filePath, content);
console.log('✓ Cleared all image fields from properties');
process.exit(0);
