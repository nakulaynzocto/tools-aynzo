const { cpSync, existsSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');

[[ '.next/static', '.next/standalone/.next/static' ],
 [ 'public', '.next/standalone/public' ]].forEach(([src, dest]) => {
  const srcPath = join(__dirname, '..', src);
  const destPath = join(__dirname, '..', dest);
  if (existsSync(srcPath)) {
    mkdirSync(dirname(destPath), { recursive: true });
    cpSync(srcPath, destPath, { recursive: true });
  }
});

