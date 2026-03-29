
const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../lib/tools.ts');
const enPath = path.join(__dirname, '../messages/en.json');

const content = fs.readFileSync(toolsPath, 'utf8');
const enMessages = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Extract blocks that look like tool objects
const blocks = content.match(/\{[\s\S]*?slug:\s*'[^']+'[\s\S]*?\}/g) || [];

blocks.forEach(block => {
    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    const descMatch = block.match(/description:\s*'([^']+)'/);
    
    if (slugMatch && nameMatch) {
        const slug = slugMatch[1];
        const name = nameMatch[1];
        const description = descMatch ? descMatch[1] : '';
        
        if (!enMessages.Tools[slug]) enMessages.Tools[slug] = {};
        enMessages.Tools[slug].name = name;
        if (description) enMessages.Tools[slug].description = description;
    }
});

fs.writeFileSync(enPath, JSON.stringify(enMessages, null, 4));
console.log(`Sync complete. Found ${blocks.length} tool blocks.`);
