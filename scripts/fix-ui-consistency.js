/**
 * fix-ui-consistency.js
 * Applies consistent UI classes and SEO bolding to all existing translated messages.
 * Safe to run multiple times (idempotent).
 */
const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../messages');
const LANGS = ['hi', 'ar', 'ru', 'de', 'fr', 'es', 'pt', 'zh', 'ja', 'ko', 'id', 'tr', 'it'];

let totalFixed = 0;
let totalSkipped = 0;

console.log('\n🎨 UI Consistency Fixer\n');

LANGS.forEach(lang => {
    const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  ${lang}.json not found, skipping.`);
        return;
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        console.log(`   ❌ Failed to parse ${lang}.json`);
        return;
    }

    if (!data.Tools) return;

    let changed = false;

    Object.keys(data.Tools).forEach(slug => {
        let content = data.Tools[slug].content;
        if (!content) return;

        const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Step 1: Strip any existing classes from tags (clean slate)
        let fixed = content
            .replace(/<p(?:\s+class="[^"]*")?>/g, '<p class="mb-4 leading-relaxed text-gray-700">')
            .replace(/<h2(?:\s+class="[^"]*")?>/g, '<h2 class="text-xl md:text-2xl font-bold mt-8 mb-4 text-primary">')
            .replace(/<h3(?:\s+class="[^"]*")?>/g, '<h3 class="text-lg md:text-xl font-semibold mt-6 mb-3">')
            .replace(/<ul(?:\s+class="[^"]*")?>/g, '<ul class="list-disc ml-6 mb-4 space-y-1">')
            .replace(/<li(?:\s+class="[^"]*")?>/g, '<li class="text-gray-600">');

        // Step 2: Remove old/broken double-strong wrapping
        fixed = fixed.replace(/<strong><strong>/gi, '<strong>').replace(/<\/strong><\/strong>/gi, '</strong>');

        // Step 3: Remove all existing <strong> around tool names, then re-add cleanly
        const safeTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const safeSlug = slug.replace(/-/g, ' ').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        fixed = fixed.replace(/<strong>(.*?)<\/strong>/gi, '$1');
        fixed = fixed.replace(new RegExp(`(${safeTitle}|${safeSlug})`, 'gi'), '<strong>$1</strong>');

        // Step 4: Remove leftover UI comments
        fixed = fixed.replace(/<!-- UI Section -->/g, '');

        if (fixed !== content) {
            data.Tools[slug].content = fixed;
            changed = true;
            totalFixed++;
        } else {
            totalSkipped++;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf-8');
        console.log(`   ✅ ${lang}.json updated`);
    } else {
        console.log(`   ⏭  ${lang}.json — already consistent`);
    }
});

console.log(`\n✨ Done! Fixed: ${totalFixed} entries, Skipped: ${totalSkipped} entries.\n`);
