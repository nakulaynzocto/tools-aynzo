#!/usr/bin/env node

/**
 * Apply SEO Optimizations Script
 * Applies generated SEO content to lib/seo.ts and all language files
 */

const fs = require('fs');
const path = require('path');
const { generateSEOContent, translateSEOContent } = require('./seo-optimizer');

// Languages to update
const LANGUAGES = ['en', 'hi', 'es', 'fr', 'de', 'ar', 'pt', 'ru', 'id', 'it', 'ja', 'ko', 'tr', 'zh'];

// Read tools from lib/tools.ts
function readTools() {
    const toolsPath = path.join(__dirname, '../lib/tools.ts');
    const content = fs.readFileSync(toolsPath, 'utf8');
    
    const tools = [];
    // Match each tool object more accurately
    const toolBlocks = content.match(/\{[^}]*slug:\s*'[^']+',[\s\S]*?\}/g) || [];
    
    toolBlocks.forEach(block => {
        const slugMatch = block.match(/slug:\s*'([^']+)'/);
        const categoryMatch = block.match(/category:\s*'([^']+)'/);
        const nameMatch = block.match(/name:\s*'([^']+)'/);
        
        if (slugMatch && categoryMatch && nameMatch) {
            tools.push({
                slug: slugMatch[1],
                category: categoryMatch[1],
                name: nameMatch[1]
            });
        }
    });
    
    return tools;
}

// Update lib/seo.ts
function updateSeoFile(tools) {
    console.log('📝 Updating lib/seo.ts...');
    
    const seoPath = path.join(__dirname, '../lib/seo.ts');
    let seoContent = fs.readFileSync(seoPath, 'utf8');
    
    tools.forEach(tool => {
        const seo = generateSEOContent(tool, tool.category);
        
        // Find and update the tool's SEO entry
        const toolKey = `'${tool.slug}'`;
        const titleRegex = new RegExp(`(${toolKey}:\\s*{[^}]*title:\\s*')[^']*(')`, 's');
        const descRegex = new RegExp(`(description:\\s*')[^']*(')`, 's');
        const keywordsRegex = new RegExp(`(keywords:\\s*')[^']*(')`, 's');
        const h1Regex = new RegExp(`(h1:\\s*')[^']*(')`, 's');
        
        if (seoContent.includes(toolKey)) {
            seoContent = seoContent.replace(titleRegex, `$1${seo.title}$2`);
            seoContent = seoContent.replace(descRegex, `$1${seo.description}$2`);
            seoContent = seoContent.replace(keywordsRegex, `$1${seo.keywords}$2`);
            seoContent = seoContent.replace(h1Regex, `$1${seo.h1}$2`);
        }
    });
    
    fs.writeFileSync(seoPath, seoContent);
    console.log('✅ Updated lib/seo.ts\n');
}

// Update language files
function updateLanguageFiles(tools) {
    console.log('🌍 Updating language files...\n');
    
    LANGUAGES.forEach(lang => {
        const langPath = path.join(__dirname, `../messages/${lang}.json`);
        
        if (!fs.existsSync(langPath)) {
            console.log(`⚠️  Skipping ${lang}.json (not found)`);
            return;
        }
        
        console.log(`  📝 Updating ${lang}.json...`);
        
        const langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
        
        if (!langContent.Tools) {
            console.log(`  ⚠️  No Tools section in ${lang}.json`);
            return;
        }
        
        tools.forEach(tool => {
            const seo = generateSEOContent(tool, tool.category);
            const translated = translateSEOContent(seo, lang);
            
            if (langContent.Tools[tool.slug]) {
                langContent.Tools[tool.slug].seoTitle = translated.title;
                langContent.Tools[tool.slug].seoDescription = translated.description;
                langContent.Tools[tool.slug].seoKeywords = translated.keywords;
                langContent.Tools[tool.slug].seoH1 = translated.h1;
            }
        });
        
        fs.writeFileSync(langPath, JSON.stringify(langContent, null, 4));
        console.log(`  ✅ Updated ${lang}.json`);
    });
    
    console.log('\n✅ All language files updated!\n');
}

// Main function
function main() {
    console.log('🚀 Starting SEO Application...\n');
    
    const tools = readTools();
    console.log(`📊 Found ${tools.length} tools\n`);
    
    updateSeoFile(tools);
    updateLanguageFiles(tools);
    
    console.log('🎉 SEO optimization complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review changes in lib/seo.ts');
    console.log('2. Review changes in messages/*.json');
    console.log('3. Run: npm run build');
    console.log('4. Test the application\n');
}

if (require.main === module) {
    main();
}

module.exports = { updateSeoFile, updateLanguageFiles };

