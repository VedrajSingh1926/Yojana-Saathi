import fs from 'fs';
import path from 'path';

const langs = ['en', 'hi', 'ta', 'te', 'bn'];
const dir = 'src/i18n';

langs.forEach(lang => {
  const filePath = path.join(dir, `${lang}.js`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace quotes before // Added dynamically with ",
  content = content.replace(/"\s*\n(\s*\/\/\s*Added dynamically)/g, '",\n$1');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed syntax in ${lang}.js`);
});
