const fs = require('fs');
const path = require('path');

// Languages to translate to
const languages = {
    'hi': 'Hindi',
    'ar': 'Arabic', 
    'ru': 'Russian',
    'de': 'German',
    'fr': 'French',
    'es': 'Spanish',
    'pt': 'Portuguese',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'id': 'Indonesian',
    'tr': 'Turkish',
    'it': 'Italian'
};

// Internal link pattern to fix
// Replaces /en/tools/ or /tools/ with /tools/ (clean target)
const fixInternalLinks = (html) => {
    return html.replace(/href="\/(?:en|hi|pt|es|id|de|fr|ja|ru|tr|it|ko|zh|ar)\/tools\//g, 'href="/tools/')
               .replace(/href="\/tools\//g, 'href="/tools/');
};

// Read seo.ts file and extract tool content
function extractToolContent() {
    const seoFilePath = path.join(__dirname, '../lib/seo.ts');
    const seoContent = fs.readFileSync(seoFilePath, 'utf-8');
    
    const tools = {};
    
    // Match tool entries with content field
    const toolPattern = /'([a-z0-9-]+)':\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/g;
    let match;
    
    while ((match = toolPattern.exec(seoContent)) !== null) {
        const toolSlug = match[1];
        let content = match[2].trim();
        
        // Clean up content
        content = content.replace(/\n\s+/g, '\n').trim();
        
        if (content.length > 50) {
            tools[toolSlug] = content;
        }
    }
    
    return tools;
}

// Translate text with quality check
async function translateHTMLContent(htmlContent, targetLang) {
    try {
        const { translate } = require('@vitalets/google-translate-api');
        const result = await translate(htmlContent, { to: targetLang });
        
        const translatedText = result.text;
        
        // Quality Check: If translated text is too similar to original (mostly English)
        // we don't return it for non-English target languages
        const similarity = calculateSimilarity(htmlContent, translatedText);
        
        if (similarity > 0.9 && targetLang !== 'en') {
            console.warn(`   ⚠️  Translation quality low for ${targetLang}, skipping...`);
            return null;
        }

        // Fix internal links in translated content to be locale-agnostic
        return fixInternalLinks(translatedText);
        
    } catch (error) {
        console.error(`   ⚠️  Translation error for ${targetLang}:`, error.message);
        return null; // Return null on error to avoid English contamination
    }
}

// Simple similarity check
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    // Just a rough character-based similarity for speed
    const len = Math.max(str1.length, str2.length);
    let common = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) common++;
    }
    return common / len;
}

// Update messages file with translated content
function updateMessagesFile(lang, toolSlug, translatedContent) {
    if (!translatedContent) return false;
    
    const messagesPath = path.join(__dirname, `../messages/${lang}.json`);
    
    if (!fs.existsSync(messagesPath)) {
        return false;
    }
    
    try {
        const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
        
        if (!messages.Tools) messages.Tools = {};
        if (!messages.Tools[toolSlug]) messages.Tools[toolSlug] = {};
        
        // Add content
        messages.Tools[toolSlug].content = translatedContent;
        
        fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 4) + '\n', 'utf-8');
        return true;
    } catch (error) {
        console.error(`   ✗ Error updating ${lang}.json:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Smart Blog Translation Script (v2.0)\n');
    
    const tools = extractToolContent();
    console.log(`   ✓ Found ${Object.keys(tools).length} tools with master content\n`);
    
    let hasTranslationLib = false;
    try {
        require.resolve('@vitalets/google-translate-api');
        hasTranslationLib = true;
    } catch (e) {
        console.log('   ❌ Error: @vitalets/google-translate-api not found.');
        console.log('   Run: npm install @vitalets/google-translate-api');
        return;
    }
    
    for (const [toolSlug, content] of Object.entries(tools)) {
        console.log(`\n📝 Processing: ${toolSlug}`);
        
        for (const [langCode, langName] of Object.entries(languages)) {
            process.stdout.write(`   Translating to ${langName} (${langCode})... `);
            
            const translatedContent = await translateHTMLContent(content, langCode);
            
            if (translatedContent) {
                const success = updateMessagesFile(langCode, toolSlug, translatedContent);
                console.log(success ? '✓' : '✗ File Error');
            } else {
                console.log('⚡ Skipped (Low Quality/Error)');
            }
            
            // 2s delay to respect API limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n✅ Process completed! Links Fixed & Content Cleaned.');
}

if (require.main === module) {
    main().catch(error => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
}

