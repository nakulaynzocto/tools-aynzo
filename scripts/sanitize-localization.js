
const fs = require('fs');
const path = require('path');
const https = require('https');

const GAS_URL = "https://script.google.com/macros/s/AKfycbz5QKfrbH3a8OwHKPjjIn4wYkZEEKyEujB7LUqVLxmkzHON8S_EMRGay_gbvXLLOmQ9/exec";
const MESSAGES_DIR = path.join(__dirname, '../messages');
const SEO_PATH = path.join(__dirname, '../lib/seo.ts');

const SCRIPTS = { hi: /[\u0900-\u097F]/, ar: /[\u0600-\u06FF]/, ru: /[\u0400-\u04FF]/, zh: /[\u4e00-\u9fa5]/, ja: /[\u3040-\u30ff]/, ko: /[\uac00-\ud7af]/ };
const FOREIGN_SCRIPTS = [ { name: 'Arabic', regex: /[\u0600-\u06FF]/, lang: 'ar' }, { name: 'Devanagari', regex: /[\u0900-\u097F]/, lang: 'hi' }, { name: 'Cyrillic', regex: /[\u0400-\u04FF]/, lang: 'ru' } ];

async function translate(text, target, retries = 2) {
    if (!text || text.trim().length === 0) return text;
    if (text.length > 2500) {
        const parts = text.split(/(\n\n|<h2|<h3)/);
        const res = [];
        for (const p of parts) { res.push(p.trim() ? await translate(p, target, retries) || p : p); await new Promise(r => setTimeout(r, 100)); }
        return res.join('');
    }
    const execute = (url, timeoutMs) => new Promise((resolve) => {
        const timer = setTimeout(() => { resolve(null); }, timeoutMs);
        const handleReq = (reqUrl) => {
            const req = https.get(reqUrl, (res) => {
                if (res.statusCode === 302 || res.statusCode === 301) {
                    handleReq(res.headers.location);
                    return;
                }
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                    clearTimeout(timer);
                    try { resolve(JSON.parse(data).text || null); } catch(e) { resolve(null); }
                });
            });
            req.on('error', () => { clearTimeout(timer); resolve(null); });
            req.setTimeout(5000, () => { req.destroy(); resolve(null); });
        };
        handleReq(url);
    });

    for (let i = 0; i <= retries; i++) {
        const result = await execute(`${GAS_URL}?target=${target}&text=${encodeURIComponent(text)}`, 8000);
        if (result) return result;
        if (i < retries) await new Promise(r => setTimeout(r, 1500 * (i + 1))); 
    }
    return null;
}

function extractToolData(slug, rawSEO) {
    const searchStr = `'${slug}': {`;
    const toolStart = rawSEO.indexOf(searchStr);
    if (toolStart === -1) return null;
    const toolEnd = rawSEO.indexOf('\n    },', toolStart);
    const body = rawSEO.substring(toolStart, toolEnd !== -1 ? toolEnd : rawSEO.length);
    const cm = /content:\s*`([\s\S]*?)`/.exec(body);
    let faqs = [];
    const fm = /faq:\s*\[([\s\S]*?)\]/.exec(body);
    if (fm) {
        const entries = fm[1].match(/\{\s*question:[\s\S]*?answer:[\s\S]*?\}/g);
        if (entries) {
            for (const entry of entries) {
                const qm = /question:\s*(['"])((?:\\.|(?!\1).)*)\1/.exec(entry);
                const am = /answer:\s*(['"])((?:\\.|(?!\1).)*)\1/.exec(entry);
                if (qm && am) faqs.push({ question: qm[2].replace(/\\'/g, "'").replace(/\\"/g, '"'), answer: am[2].replace(/\\'/g, "'").replace(/\\"/g, '"') });
            }
        }
    }
    return { content: cm ? cm[1].trim() : null, faqs };
}

async function fixLang(lang) {
    if (lang === 'en') { console.log(`[en] Skipping`); return; }
    console.log(`\n>>> STARTING LANGUAGE: [${lang.toUpperCase()}]`);
    const rawSEO = fs.readFileSync(SEO_PATH, 'utf-8');
    const enMessages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'en.json'), 'utf-8'));
    const enTools = enMessages.Tools;
    const slugs = Object.keys(enTools).filter(s => typeof enTools[s] === 'object');
    
    // Pre-cache SEO tool data
    const toolSEO = {};
    for (const slug of slugs) { toolSEO[slug] = extractToolData(slug, rawSEO); }

    const fPath = path.join(MESSAGES_DIR, `${lang}.json`);
    const messages = JSON.parse(fs.readFileSync(fPath, 'utf-8'));
    if (!messages.Tools) messages.Tools = {};

    const BATCH_SIZE = 10;
    for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
        const chunk = slugs.slice(i, i + BATCH_SIZE);
        console.log(`  [${lang}] Processing Tools ${i + 1} to ${Math.min(i + BATCH_SIZE, slugs.length)} / ${slugs.length}...`);
        
        await Promise.all(chunk.map(async (slug) => {
            const enT = enTools[slug];
            let t = messages.Tools[slug];
            let changed = false;
            if (!t) { t = messages.Tools[slug] = {}; changed = true; }

            const fields = ['name', 'description', 'seoTitle', 'seoDescription', 'seoH1'];
            for (const field of fields) {
                const val = t[field] || '';
                const enVal = enT[field] || '';
                if (!enVal) continue;
                let repair = !val || ((/^[\s\x00-\x7F]*$/.test(val) && lang !== 'en'));
                FOREIGN_SCRIPTS.forEach(script => { if (script.lang !== lang && script.regex.test(val)) repair = true; });
                if (repair) {
                    const res = await translate(enVal, lang);
                    if (res) { t[field] = res; changed = true; }
                }
            }

            const src = toolSEO[slug];
            if (src) {
                const cVal = t.content || '';
                const cTxt = cVal.replace(/<[^>]*>/g, '');
                let repairC = !cVal || (cTxt.length > 50 && /^[\s\x00-\x7F]*$/.test(cTxt) && lang !== 'en');
                FOREIGN_SCRIPTS.forEach(script => { if (script.lang !== lang && script.regex.test(cTxt)) repairC = true; });
                if (repairC && src.content) {
                    const res = await translate(src.content, lang);
                    if (res) { t.content = res; changed = true; }
                }

                const fTxt = JSON.stringify(t.faq || '');
                let repairF = !t.faq || (src.faqs.length > 0 && t.faq.length < src.faqs.length);
                FOREIGN_SCRIPTS.forEach(script => { if (script.lang !== lang && script.regex.test(fTxt)) repairF = true; });
                if (repairF && src.faqs.length > 0) {
                    const res = []; let ok = true;
                    for (const item of src.faqs) {
                        const q = await translate(item.question, lang);
                        const a = await translate(item.answer, lang);
                        if (q && a) res.push({ question: q, answer: a }); else { ok = false; break; }
                    }
                    if (ok) { t.faq = res; changed = true; }
                }
            }
            if (changed) { 
                fs.writeFileSync(fPath, JSON.stringify(messages, null, 4)); 
            }
        }));
        // Small rest to prevent rate limit
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log(`>>> [${lang.toUpperCase()}] COMPLETED\n`);
}

async function runBatches() {
    const list = ['hi', 'ar', 'ru', 'de', 'fr', 'es', 'pt', 'zh', 'ja', 'ko', 'id', 'tr', 'it'];
    for (const l of list) {
        await fixLang(l);
    }
}
runBatches();
