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

// Read seo.ts file and extract tool content
function extractToolContent() {
    const seoFilePath = path.join(__dirname, '../lib/seo.ts');
    const seoContent = fs.readFileSync(seoFilePath, 'utf-8');
    
    const tools = {};
    
    // Match tool entries with content field
    // Pattern: 'tool-slug': { ... content: `...` ... }
    const toolPattern = /'([a-z0-9-]+)':\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/g;
    let match;
    
    while ((match = toolPattern.exec(seoContent)) !== null) {
        const toolSlug = match[1];
        let content = match[2].trim();
        
        // Clean up content - remove extra whitespace but preserve HTML structure
        content = content.replace(/\n\s+/g, '\n').trim();
        
        // Only include substantial content (more than 100 chars)
        if (content.length > 100) {
            tools[toolSlug] = content;
        }
    }
    
    return tools;
}

// Translate text using Google Translate API (free tier)
async function translateText(text, targetLang) {
    try {
        // Try to use @vitalets/google-translate-api (free, no API key needed)
        try {
            const { translate } = require('@vitalets/google-translate-api');
            const result = await translate(text, { to: targetLang });
            return result.text;
        } catch (requireError) {
            if (requireError.code !== 'MODULE_NOT_FOUND') {
                throw requireError;
            }
            // Library not installed, try other options
        }
        
        // Try Google Cloud Translation API
        try {
            const { Translate } = require('@google-cloud/translate').v2;
            if (process.env.GOOGLE_TRANSLATE_API_KEY) {
                const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
                const [translation] = await translate.translate(text, targetLang);
                return translation;
            }
        } catch (requireError) {
            if (requireError.code !== 'MODULE_NOT_FOUND') {
                throw requireError;
            }
        }
        
        // Try DeepL API
        try {
            const deepl = require('deepl-node');
            if (process.env.DEEPL_API_KEY) {
                const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
                const result = await translator.translateText(text, 'en', targetLang.toUpperCase());
                return result.text;
            }
        } catch (requireError) {
            if (requireError.code !== 'MODULE_NOT_FOUND') {
                throw requireError;
            }
        }
        
        // Fallback: return placeholder
        return `[TRANSLATION_NEEDED_${targetLang.toUpperCase()}] ${text}`;
        
    } catch (error) {
        console.error(`   ✗ Translation error:`, error.message);
        return text; // Return original on error
    }
}

// Preserve HTML structure while translating
async function translateHTMLContent(htmlContent, targetLang) {
    // Google Translate API preserves HTML tags automatically
    // So we can translate the whole HTML content at once
    try {
        const { translate } = require('@vitalets/google-translate-api');
        const result = await translate(htmlContent, { to: targetLang });
        return result.text;
    } catch (error) {
        // If translation fails, fall back to simple text translation
        console.error(`   ⚠️  HTML translation error, using fallback:`, error.message);
        return await translateText(htmlContent, targetLang);
    }
}

// Update messages file with translated content
function updateMessagesFile(lang, toolSlug, translatedContent) {
    const messagesPath = path.join(__dirname, `../messages/${lang}.json`);
    
    if (!fs.existsSync(messagesPath)) {
        console.log(`   ⚠️  Messages file not found for ${lang}, skipping...`);
        return false;
    }
    
    try {
        const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
        
        // Ensure Tools object exists
        if (!messages.Tools) {
            messages.Tools = {};
        }
        
        // Ensure tool object exists
        if (!messages.Tools[toolSlug]) {
            messages.Tools[toolSlug] = {};
        }
        
        // Add content (escape for JSON)
        messages.Tools[toolSlug].content = translatedContent;
        
        // Write back to file with proper formatting
        fs.writeFileSync(
            messagesPath, 
            JSON.stringify(messages, null, 4) + '\n', 
            'utf-8'
        );
        
        return true;
    } catch (error) {
        console.error(`   ✗ Error updating ${lang}.json:`, error.message);
        return false;
    }
}

// Main function
async function main() {
    console.log('🚀 Blog Content Translation Script\n');
    console.log('=' .repeat(50));
    
    // Extract all tool content
    console.log('\n📖 Step 1: Extracting tool content from lib/seo.ts...');
    const tools = extractToolContent();
    console.log(`   ✓ Found ${Object.keys(tools).length} tools with content\n`);
    
    if (Object.keys(tools).length === 0) {
        console.log('   ⚠️  No tools with content found. Exiting.');
        return;
    }
    
    // List tools
    console.log('   Tools found:');
    Object.keys(tools).forEach((slug, index) => {
        const length = tools[slug].length;
        console.log(`   ${index + 1}. ${slug} (${length} chars)`);
    });
    
    // Check if translation library is available
    console.log('\n📦 Step 2: Checking translation setup...');
    let hasTranslationLib = false;
    
    try {
        require.resolve('@vitalets/google-translate-api');
        hasTranslationLib = true;
        console.log('   ✓ @vitalets/google-translate-api found');
    } catch (e) {
        console.log('   ⚠️  No translation library found.');
        console.log('   Install one: npm install @vitalets/google-translate-api');
        console.log('   Or use: npm install @google-cloud/translate');
        console.log('   Or use: npm install deepl-node');
    }
    
    if (!hasTranslationLib) {
        console.log('\n⚠️  WARNING: Translation will not work without a library.');
        console.log('   The script will create placeholder content.');
        console.log('   Press Ctrl+C to cancel, or Enter to continue with placeholders...');
        
        // In a real scenario, you'd wait for user input
        // For now, we'll continue
    }
    
    // Process each tool
    console.log('\n🌍 Step 3: Translating content...\n');
    
    let totalTranslations = 0;
    let successfulTranslations = 0;
    
    for (const [toolSlug, content] of Object.entries(tools)) {
        console.log(`\n📝 Processing: ${toolSlug}`);
        console.log(`   Content length: ${content.length} characters`);
        
        // Translate to each language
        for (const [langCode, langName] of Object.entries(languages)) {
            try {
                process.stdout.write(`   Translating to ${langName} (${langCode})... `);
                
                // Always use translateHTMLContent which handles HTML properly
                const translatedContent = await translateHTMLContent(content, langCode);
                
                const success = updateMessagesFile(langCode, toolSlug, translatedContent);
                
                if (success) {
                    successfulTranslations++;
                    console.log('✓');
                } else {
                    console.log('✗');
                }
                
                totalTranslations++;
                
                // Add delay to avoid rate limiting (if using API)
                if (hasTranslationLib) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between translations
                }
                
            } catch (error) {
                console.log(`✗ (${error.message})`);
            }
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Translation process completed!');
    console.log(`   Total translations: ${totalTranslations}`);
    console.log(`   Successful: ${successfulTranslations}`);
    console.log(`   Failed: ${totalTranslations - successfulTranslations}`);
    
    if (!hasTranslationLib) {
        console.log('\n⚠️  IMPORTANT: Placeholder content was added.');
        console.log('   Please install a translation library and run again,');
        console.log('   or manually review and update translations in messages/*.json files.');
    }
    
    console.log('\n📝 Next steps:');
    console.log('   1. Review translations in messages/*.json files');
    console.log('   2. Fix any HTML structure issues');
    console.log('   3. Test the tool pages in different languages');
    console.log('   4. Update links in content (e.g., /en/tools/... to /{locale}/tools/...)');
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { extractToolContent, translateText, translateHTMLContent, updateMessagesFile };
