const fs = require('fs');
const path = require('path');

const adminDir = 'C:\\Users\\user\\.openclaw\\workspace\\ningclean\\apps\\admin\\src\\app\\admin';

// Pattern lama
const oldPattern = /function ActionBtn\(\{ variant = 'outline', children, onClick, loading, className = '' \}: \{ variant\?: string; children: React\.ReactNode; onClick\?: \(\) => void; loading\?: boolean; className\?: string \}\)/g;

// Pattern baru dengan type support
const newPattern = `function ActionBtn({ variant = 'outline', children, onClick, loading, className = '', type = 'button' }: { variant?: string; children: React.ReactNode; onClick?: (e?: React.FormEvent) => void | Promise<void>; loading?: boolean; className?: string; type?: 'button' | 'submit' })`;

// Update button element
const oldButton = /<button onClick=\{onClick\} disabled=\{loading\}/g;
const newButton = `<button type={type} onClick={onClick} disabled={loading}`;

const files = fs.readdirSync(adminDir)
  .filter(f => fs.statSync(path.join(adminDir, f)).isDirectory())
  .map(d => path.join(adminDir, d, 'page.tsx'))
  .filter(f => fs.existsSync(f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if file has ActionBtn
  if (content.includes('function ActionBtn')) {
    // Replace function signature
    content = content.replace(oldPattern, newPattern);
    
    // Replace button element
    content = content.replace(oldButton, newButton);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

console.log('Done!');
