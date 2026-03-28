/**
 * translate-json-blogs.js
 * Translates the generated JSON blog articles into 13 other languages.
 * Uses the same GAS engine as the main translation script.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const BLOGS_DIR = path.join(__dirname, '../seo-blogs');
const GAS_URL = "https://script.google.com/macros/s/AKfycbz5QKfrbH3a8OwHKPjjIn4wYkZEEKyEujB7LUqVLxmkzHON8S_EMRGay_gbvXLLOmQ9/exec";
const DELAY_MS = 1500; // Small delay to avoid rate limiting

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

async function translateText(text, targetLang) {
    if (!text || text.length < 2) return text;
    
    return new Promise((resolve) => {
        const url = `${GAS_URL}?target=${targetLang}&text=${encodeURIComponent(text)}`;
        
        function makeRequest(currentUrl) {
            https.get(currentUrl, (res) => {
                if (res.statusCode === 302 || res.statusCode === 301) {
                    makeRequest(res.headers.location);
                    return;
                }
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.translatedText || text);
                    } catch (e) {
                        console.error(`❌ Translation error for ${targetLang}:`, data.substring(0, 100));
                        resolve(text);
                    }
                });
            }).on('error', (e) => {
                console.error(`❌ Network error for ${targetLang}:`, e.message);
                resolve(text);
            });
        }
        
        makeRequest(url);
    });
}

async function run() {
    const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
    
    console.log(`\n🌍 Translating ${files.length} blog articles into ${Object.keys(languages).length} languages...\n`);

    for (const langCode of Object.keys(languages)) {
        const langDir = path.join(BLOGS_DIR, langCode);
        if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

        console.log(`\n💎 Processing ${languages[langCode]} (${langCode})...`);

        for (const file of files) {
            const filePath = path.join(BLOGS_DIR, file);
            const targetPath = path.join(langDir, file);
            
            if (fs.existsSync(targetPath)) {
                console.log(`   ⏭️ Skipping ${file} (already exists)`);
                continue;
            }

            const blog = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            console.log(`   📄 Translating ${file}...`);

            const translatedBlog = { ...blog };
            
            // Translate key fields
            translatedBlog.title = await translateText(blog.title, langCode);
            await new Promise(r => setTimeout(r, DELAY_MS)); // Rate limit protection
            
            translatedBlog.metaTitle = await translateText(blog.metaTitle, langCode);
            await new Promise(r => setTimeout(r, DELAY_MS));
            
            translatedBlog.metaDescription = await translateText(blog.metaDescription, langCode);
            await new Promise(r => setTimeout(r, DELAY_MS));
            
            translatedBlog.content = await translateText(blog.content, langCode);
            await new Promise(r => setTimeout(r, DELAY_MS));

            // Fix localized internal link
            translatedBlog.internalLink = blog.internalLink.replace('/en/tools/', `/${langCode}/tools/`);

            fs.writeFileSync(targetPath, JSON.stringify(translatedBlog, null, 2));
            console.log(`   ✅ Saved: ${langCode}/${file}`);
        }
    }

    console.log('\n✨ All translations complete!');
}

run();
