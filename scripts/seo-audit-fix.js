/**
 * seo-audit-fix.js
 * Finds tools missing seoTitle / seoDescription and auto-generates them.
 */
const fs = require('fs');
const path = require('path');

const LANGS = ['hi','ar','ru','de','fr','es','pt','zh','ja','ko','id','tr','it'];
const MESSAGES_DIR = path.join(__dirname, '../messages');

let totalFixed = 0;

console.log('\n🔍 SEO Audit & Auto-Fix\n');

LANGS.forEach(lang => {
    const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
    if (!fs.existsSync(filePath)) return;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const tools = data.Tools || {};
    let changed = false;

    Object.keys(tools).forEach(slug => {
        const t = tools[slug];
        const name = t.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const description = t.description || '';

        // Fix missing seoTitle
        if (!t.seoTitle) {
            t.seoTitle = `${name} - Free Online Tool | Aynzo Tools`;
            changed = true;
            totalFixed++;
            console.log(`  ✏️  [${lang}] ${slug} → seoTitle generated`);
        }

        // Fix missing seoDescription
        if (!t.seoDescription) {
            t.seoDescription = description
                ? `${description} Free, fast, and secure. No signup required.`
                : `Use our free online ${name} tool. Fast, secure, and easy to use. No login required.`;
            changed = true;
            totalFixed++;
            console.log(`  ✏️  [${lang}] ${slug} → seoDescription generated`);
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf-8');
        console.log(`  ✅ ${lang}.json saved\n`);
    }
});

console.log(`\n✨ Done! Total fixes applied: ${totalFixed}`);
