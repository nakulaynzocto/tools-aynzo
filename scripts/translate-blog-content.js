const fs = require('fs');
const path = require('path');
const https = require('https');

// --- SETTINGS ---
const DELAY_MS = 2000; // FAST mode using Google Apps Script (GAS)
const GAS_URL = "https://script.google.com/macros/s/AKfycbz5QKfrbH3a8OwHKPjjIn4wYkZEEKyEujB7LUqVLxmkzHON8S_EMRGay_gbvXLLOmQ9/exec";
const maxRetries = 1;

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

// Beautify HTML for both UI and SEO
const beautifyHTML = (html, toolSlug) => {
    if (!html) return html;
    
    // Convert generic tool name (slug) to Readable Title
    const title = toolSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    let processed = html
        // 1. Semantic Spacing & Structure (UI Downsizing)
        .replace(/<p>/g, '<p class="mb-4 leading-relaxed text-gray-700">')
        .replace(/<h2>/g, `<h2 class="text-xl md:text-2xl font-bold mt-8 mb-4 text-primary flex items-center gap-2">`)
        .replace(/<h3>/g, '<h3 class="text-lg md:text-xl font-semibold mt-6 mb-3 text-primary/80">')
        .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 space-y-1">')
        .replace(/<li>/g, '<li class="text-gray-600">')
        
        // 2. SEO Enhancement: Bold the tool name/concepts
        .replace(new RegExp(`(${title}|${toolSlug.replace(/-/g, ' ')})`, 'gi'), '<strong>$1</strong>')
        
        // 3. UI Polish: Adding subtle icons/separators (if they don't exist)
        .replace(/<h2/g, '<!-- UI Section --><h2')
        
    return processed;
};

// Internal link pattern to fix
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

// Translate text with quality check and retry logic
async function translateHTMLContent(htmlContent, targetLang, toolSlug, attempt = 1) {
    return new Promise((resolve) => {
        // GAS handles GET parameters well up to ~8KB
        const url = `${GAS_URL}?target=${targetLang}&text=${encodeURIComponent(htmlContent)}`;
        
        function handleRequest(requestUrl) {
            https.get(requestUrl, (res) => {
                // GAS URLs often redirect (302) to another server
                if (res.statusCode === 302 || res.statusCode === 301) {
                    handleRequest(res.headers.location);
                    return;
                }
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.text) {
                            // Quality check against original
                            const similarity = calculateSimilarity(htmlContent, json.text);
                            if (similarity > 0.9 && targetLang !== 'en') {
                                console.log(' (Low Quality Res) ');
                                resolve(null);
                            } else {
                                // APPLY BEAUTIFICATION & SEO
                                let finalized = fixInternalLinks(json.text);
                                finalized = beautifyHTML(finalized, toolSlug);
                                resolve(finalized);
                            }
                        } else {
                            console.error(`\n   ⚠️ GAS API Error: ${json.error || 'Empty response'}`);
                            resolve(null);
                        }
                    } catch (e) {
                        console.error(`\n   ⚠️ JSON Parse Error from GAS`);
                        resolve(null);
                    }
                });
            }).on('error', (err) => {
                console.error(`\n   ⚠️ Request Error: ${err.message}`);
                resolve(null);
            });
        }
        
        handleRequest(url);
    });
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

// --- UTILITIES ---

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
        
        // Skip if already translated (contains non-English content)
        const currentContent = messages.Tools[toolSlug].content || "";
        
        // Just always update if it's not the exact same as translatedContent
        if (currentContent === translatedContent) {
            return 'skipped-same';
        }

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
    console.log('🚀 Smart Blog Translation Script (v3.5 - GAS Edition)\n');
    console.log(`   ⏳ Delay: ${DELAY_MS}ms per request\n`);
    
    const tools = extractToolContent();
    console.log(`   ✓ Found ${Object.keys(tools).length} tools. Using GAS Engine (Fast Mode).\n`);
    
    let hasTranslationLib = true; // No external lib needed for GAS engine
    
    for (const [toolSlug, content] of Object.entries(tools)) {
        console.log(`\n📝 Processing: ${toolSlug}`);
        
        for (const [langCode, langName] of Object.entries(languages)) {
            // Check if already localized in messages file
            const messagesPath = path.join(__dirname, `../messages/${langCode}.json`);
            let skip = false;
            
            if (fs.existsSync(messagesPath)) {
                try {
                    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
                    const existing = messages.Tools?.[toolSlug]?.content || "";
                    
                    // SMART SKIP: If it's pure English (all ASCII + common English words), then we NEED to translate it.
                    // If it contains non-ASCII or localized keywords, we skip it.
                    if (existing && existing.length > 50) {
                        const isEnglish = /^[\s\x00-\x7F]*$/.test(existing.replace(/<[^>]*>/g, ''));
                        const hasBoilerplate = existing.includes("In the digital age") || existing.includes("Our tool is a professional");
                        
                        if (!isEnglish && !hasBoilerplate) {
                            skip = true;
                        }
                    }
                } catch (e) {}
            }

            if (skip) {
                console.log(`   ⏭  Skipping ${langName} (${langCode})... Already localized.`);
                continue;
            }

            process.stdout.write(`   Translating to ${langName} (${langCode})... `);
            
            const translatedContent = await translateHTMLContent(content, langCode, toolSlug);
            
            if (translatedContent) {
                const success = updateMessagesFile(langCode, toolSlug, translatedContent);
                console.log(success === 'skipped-same' ? '✓ (No Change)' : (success ? '✓' : '✗ File Error'));
            } else {
                console.log('⚡ Skipped (Low Quality/Error)');
            }
            
            // Wait to respect API limits with small random jitter
            const jitter = Math.floor(Math.random() * 2000);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS + jitter));
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

