#!/usr/bin/env node

/**
 * SEO Optimizer Script
 * Automatically generates and applies high-quality SEO optimizations
 * to all tools across all languages
 */

const fs = require('fs');
const path = require('path');

// Tool categories and their SEO patterns
const SEO_PATTERNS = {
    'image': {
        titleTemplate: 'Free {name} Online - {action} No Signup',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name} online, {action} no signup, {name} tool free'
    },
    'pdf': {
        titleTemplate: '{name} Free - Convert Online No Signup',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, {name} converter free'
    },
    'text': {
        titleTemplate: '{name} Free Online - {action}',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, {name} tool free'
    },
    'converter': {
        titleTemplate: '{name} Free - Convert Online No Signup',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, {name} converter free'
    },
    'security': {
        titleTemplate: '{name} Free - {action}',
        descriptionTemplate: '{action} online free. {benefits}. No login, 100% private. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, secure {name} tool'
    },
    'calculator': {
        titleTemplate: '{name} Free Online - Calculate {metric}',
        descriptionTemplate: 'Calculate {metric} online free. {benefits}. No login, fast, accurate. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name}, calculate {metric} online, {name} calculator free'
    },
    'utility': {
        titleTemplate: '{name} Free - Generate {type}',
        descriptionTemplate: 'Generate {type} online free. {benefits}. No login, fast, secure. Perfect for {useCase}.',
        keywordsTemplate: '{keywords}, free {name}, generate {type} online, {name} generator free'
    },
    'developer': {
        titleTemplate: '{name} Free - {action} Code',
        descriptionTemplate: '{action} code online free. {benefits}. No login, fast, secure. Perfect for developers.',
        keywordsTemplate: '{keywords}, free {name}, {action} code online, {name} tool free'
    },
    'youtube': {
        titleTemplate: '{name} Free - {action}',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for content creators.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, youtube {name} tool'
    },
    'seo': {
        titleTemplate: '{name} Free - {action}',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for website optimization.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, seo {name} tool'
    },
    'social': {
        titleTemplate: '{name} Free - {action}',
        descriptionTemplate: '{action} online free. {benefits}. No login, fast, secure. Perfect for social media.',
        keywordsTemplate: '{keywords}, free {name}, {action} online, social media {name} tool'
    }
};

// Language-specific translations
const LANGUAGE_TRANSLATIONS = {
    hi: { // Hindi
        'Free': 'मुफ्त',
        'Online': 'ऑनलाइन',
        'No Signup': 'साइनअप नहीं',
        'No login': 'लॉगिन नहीं',
        'fast': 'तेज',
        'secure': 'सुरक्षित',
        'Perfect for': 'के लिए परफेक्ट',
        'Convert': 'कन्वर्ट',
        'Generate': 'जेनरेट',
        'Calculate': 'कैलकुलेट',
        'Format': 'फॉर्मेट',
        'Optimize': 'ऑप्टिमाइज़'
    },
    es: { // Spanish
        'Free': 'Gratis',
        'Online': 'En Línea',
        'No Signup': 'Sin Registro',
        'No login': 'Sin inicio de sesión',
        'fast': 'rápido',
        'secure': 'seguro',
        'Perfect for': 'Perfecto para',
        'Convert': 'Convertir',
        'Generate': 'Generar',
        'Calculate': 'Calcular',
        'Format': 'Formatear',
        'Optimize': 'Optimizar'
    },
    fr: { // French
        'Free': 'Gratuit',
        'Online': 'En Ligne',
        'No Signup': 'Sans Inscription',
        'No login': 'Sans connexion',
        'fast': 'rapide',
        'secure': 'sécurisé',
        'Perfect for': 'Parfait pour',
        'Convert': 'Convertir',
        'Generate': 'Générer',
        'Calculate': 'Calculer',
        'Format': 'Formater',
        'Optimize': 'Optimiser'
    },
    de: { // German
        'Free': 'Kostenlos',
        'Online': 'Online',
        'No Signup': 'Keine Anmeldung',
        'No login': 'Keine Anmeldung',
        'fast': 'schnell',
        'secure': 'sicher',
        'Perfect for': 'Perfekt für',
        'Convert': 'Konvertieren',
        'Generate': 'Generieren',
        'Calculate': 'Berechnen',
        'Format': 'Formatieren',
        'Optimize': 'Optimieren'
    },
    ar: { // Arabic
        'Free': 'مجاني',
        'Online': 'عبر الإنترنت',
        'No Signup': 'بدون تسجيل',
        'No login': 'بدون تسجيل دخول',
        'fast': 'سريع',
        'secure': 'آمن',
        'Perfect for': 'مثالي لـ',
        'Convert': 'تحويل',
        'Generate': 'إنشاء',
        'Calculate': 'حساب',
        'Format': 'تنسيق',
        'Optimize': 'تحسين'
    },
    pt: { // Portuguese
        'Free': 'Grátis',
        'Online': 'Online',
        'No Signup': 'Sem Cadastro',
        'No login': 'Sem login',
        'fast': 'rápido',
        'secure': 'seguro',
        'Perfect for': 'Perfeito para',
        'Convert': 'Converter',
        'Generate': 'Gerar',
        'Calculate': 'Calcular',
        'Format': 'Formatar',
        'Optimize': 'Otimizar'
    },
    ru: { // Russian
        'Free': 'Бесплатно',
        'Online': 'Онлайн',
        'No Signup': 'Без Регистрации',
        'No login': 'Без входа',
        'fast': 'быстро',
        'secure': 'безопасно',
        'Perfect for': 'Идеально для',
        'Convert': 'Конвертировать',
        'Generate': 'Генерировать',
        'Calculate': 'Рассчитать',
        'Format': 'Форматировать',
        'Optimize': 'Оптимизировать'
    },
    id: { // Indonesian
        'Free': 'Gratis',
        'Online': 'Online',
        'No Signup': 'Tanpa Daftar',
        'No login': 'Tanpa login',
        'fast': 'cepat',
        'secure': 'aman',
        'Perfect for': 'Sempurna untuk',
        'Convert': 'Konversi',
        'Generate': 'Buat',
        'Calculate': 'Hitung',
        'Format': 'Format',
        'Optimize': 'Optimalkan'
    },
    it: { // Italian
        'Free': 'Gratuito',
        'Online': 'Online',
        'No Signup': 'Senza Registrazione',
        'No login': 'Senza accesso',
        'fast': 'veloce',
        'secure': 'sicuro',
        'Perfect for': 'Perfetto per',
        'Convert': 'Convertire',
        'Generate': 'Generare',
        'Calculate': 'Calcolare',
        'Format': 'Formattare',
        'Optimize': 'Ottimizzare'
    },
    ja: { // Japanese
        'Free': '無料',
        'Online': 'オンライン',
        'No Signup': '登録不要',
        'No login': 'ログイン不要',
        'fast': '高速',
        'secure': '安全',
        'Perfect for': 'に最適',
        'Convert': '変換',
        'Generate': '生成',
        'Calculate': '計算',
        'Format': 'フォーマット',
        'Optimize': '最適化'
    },
    ko: { // Korean
        'Free': '무료',
        'Online': '온라인',
        'No Signup': '가입 불필요',
        'No login': '로그인 불필요',
        'fast': '빠른',
        'secure': '안전한',
        'Perfect for': '에 완벽',
        'Convert': '변환',
        'Generate': '생성',
        'Calculate': '계산',
        'Format': '포맷',
        'Optimize': '최적화'
    },
    tr: { // Turkish
        'Free': 'Ücretsiz',
        'Online': 'Çevrimiçi',
        'No Signup': 'Kayıt Yok',
        'No login': 'Giriş yok',
        'fast': 'hızlı',
        'secure': 'güvenli',
        'Perfect for': 'İçin mükemmel',
        'Convert': 'Dönüştür',
        'Generate': 'Oluştur',
        'Calculate': 'Hesapla',
        'Format': 'Biçimlendir',
        'Optimize': 'Optimize Et'
    },
    zh: { // Chinese
        'Free': '免费',
        'Online': '在线',
        'No Signup': '无需注册',
        'No login': '无需登录',
        'fast': '快速',
        'secure': '安全',
        'Perfect for': '完美适用于',
        'Convert': '转换',
        'Generate': '生成',
        'Calculate': '计算',
        'Format': '格式化',
        'Optimize': '优化'
    }
};

// Tool-specific SEO data
const TOOL_SEO_DATA = {
    'image-compressor': {
        action: 'Compress JPG, PNG, WebP images',
        benefits: 'Reduce file size up to 90% without losing quality',
        useCase: 'web optimization and social media',
        keywords: 'compress image file size online free without losing quality, reduce image file size online free, compress jpg to 50kb online, bulk image compressor free no watermark'
    },
    'image-resizer': {
        action: 'Resize JPG, PNG, WebP images',
        benefits: 'Change dimensions to exact pixels or percentage',
        useCase: 'social media and web',
        keywords: 'resize image online free, change image dimensions online, resize photo for passport, image resizer 20kb, resize image to 100kb'
    },
    'jpg-to-png': {
        action: 'Convert JPG to PNG',
        benefits: 'High quality conversion with transparency support',
        useCase: 'web graphics and logos',
        keywords: 'jpg to png converter free, convert jpg to png online, jpg to png high quality, free image format converter, jpg to png transparent background'
    },
    'png-to-jpg': {
        action: 'Convert PNG to JPG',
        benefits: 'Reduce file size with high quality',
        useCase: 'photos and web optimization',
        keywords: 'png to jpg converter free, convert png to jpg online, png to jpg high quality, free image format converter, png to jpg reduce size'
    },
    'webp-converter': {
        action: 'Convert JPG, PNG, GIF to WebP or WebP to JPG/PNG',
        benefits: 'Modern format conversion',
        useCase: 'web optimization',
        keywords: 'webp converter free, convert to webp online, webp to jpg converter, jpg to webp converter, free webp converter'
    },
    'pdf-to-word': {
        action: 'Convert PDF to Word DOCX',
        benefits: '100% editable documents, high accuracy',
        useCase: 'editing PDFs instantly',
        keywords: 'pdf to word converter free, convert pdf to word online, pdf to word editable free, online pdf to word converter, pdf to docx free'
    },
    'word-to-pdf': {
        action: 'Convert Word DOC/DOCX to PDF',
        benefits: 'Maintain formatting, high quality',
        useCase: 'documents',
        keywords: 'word to pdf converter free, convert word to pdf online, doc to pdf converter free, docx to pdf online, free word to pdf no signup'
    },
    'word-counter': {
        action: 'Count words, characters, sentences',
        benefits: 'Real-time analysis with reading time',
        useCase: 'writers and students',
        keywords: 'word counter free, character counter online, word count tool, essay word count, reading time calculator, real time word count'
    },
    'character-counter': {
        action: 'Count characters with/without spaces',
        benefits: 'Real-time counting',
        useCase: 'Twitter, SMS, meta descriptions',
        keywords: 'character counter free, count characters online, character count with spaces, twitter character counter, sms character counter'
    },
    'text-case-converter': {
        action: 'Convert text case',
        benefits: 'Uppercase, lowercase, title case, sentence case',
        useCase: 'formatting text instantly',
        keywords: 'text case converter free, uppercase to lowercase, title case converter, sentence case converter, text transformer online'
    },
    'password-generator': {
        action: 'Generate strong secure passwords',
        benefits: 'Customizable length and characters',
        useCase: 'secure accounts',
        keywords: 'password generator free, strong password generator, random password maker, secure password tool, hack proof passwords, offline password generator'
    },
    'unit-converter': {
        action: 'Convert length, weight, temperature, volume',
        benefits: 'All units supported',
        useCase: 'daily conversions',
        keywords: 'unit converter free, length converter, weight converter, temperature converter, measurement converter online, metric to imperial'
    },
    'color-converter': {
        action: 'Convert colors between HEX, RGB, HSL',
        benefits: 'Color picker included',
        useCase: 'designers',
        keywords: 'color converter free, hex to rgb converter, rgb to hex converter, hex to hsl converter, color picker online, color code converter'
    },
    'bmi-calculator': {
        action: 'Calculate BMI',
        benefits: 'Check healthy weight range',
        useCase: 'health tracking',
        keywords: 'bmi calculator free, body mass index calculator, healthy weight calculator, obesity calculator, height weight chart, bmi calculator online'
    },
    'emi-calculator': {
        action: 'Calculate loan EMI',
        benefits: 'Home, car, personal loans. Amortization schedule',
        useCase: 'loan planning',
        keywords: 'emi calculator free, loan calculator online, mortgage calculator, monthly installment calculator, interest rate calculator, home loan calculator'
    },
    'random-number': {
        action: 'Generate random numbers',
        benefits: 'Custom range support',
        useCase: 'lotteries and games',
        keywords: 'random number generator free, generate random numbers online, random number picker, dice roller, lottery number generator'
    },
    'random-string': {
        action: 'Generate random strings',
        benefits: 'Customizable length and characters',
        useCase: 'passwords',
        keywords: 'random string generator free, generate random strings online, secure password generator, random text generator, alphanumeric generator'
    },
    'random-color': {
        action: 'Generate random colors',
        benefits: 'Get HEX, RGB, HSL codes',
        useCase: 'design inspiration',
        keywords: 'random color generator free, generate random colors online, color palette generator, random hex color, design inspiration, color picker'
    },
    'lorem-ipsum': {
        action: 'Generate Lorem Ipsum placeholder text',
        benefits: 'Custom paragraphs',
        useCase: 'designers',
        keywords: 'lorem ipsum generator free, placeholder text generator, dummy text generator, lorem ipsum text, filler text generator'
    },
    'html-formatter': {
        action: 'Format and beautify HTML code',
        benefits: 'Fix indentation instantly',
        useCase: 'developers',
        keywords: 'html formatter free, beautify html online, format html code, clean html code, html beautifier tool'
    },
    'css-formatter': {
        action: 'Format and beautify CSS code',
        benefits: 'Minify or expand CSS',
        useCase: 'developers',
        keywords: 'css formatter free, beautify css online, format css code, clean css code, css beautifier tool'
    },
    'javascript-formatter': {
        action: 'Format and beautify JavaScript code',
        benefits: 'Fix indentation instantly',
        useCase: 'developers',
        keywords: 'javascript formatter free, beautify js online, format javascript code, clean js code, js beautifier tool'
    },
    'json-formatter': {
        action: 'Format, beautify, validate JSON',
        benefits: 'Minify JSON instantly',
        useCase: 'developers',
        keywords: 'json formatter free, beautify json online, format json code, validate json, json beautifier tool'
    },
    'youtube-tag-generator': {
        action: 'Generate YouTube SEO tags',
        benefits: 'Optimize video rankings',
        useCase: 'content creators',
        keywords: 'youtube tag generator free, generate youtube tags online, youtube seo tool, viral video tags, generate tags for youtube'
    },
    'youtube-title-generator': {
        action: 'Generate catchy YouTube titles',
        benefits: 'SEO-friendly titles for better CTR',
        useCase: 'content creators',
        keywords: 'youtube title generator free, generate youtube titles online, video title ideas, viral yt titles, seo titles for youtube'
    },
    'open-graph-generator': {
        action: 'Generate Open Graph meta tags',
        benefits: 'Facebook, LinkedIn, Slack',
        useCase: 'SEO',
        keywords: 'open graph generator free, generate og tags online, facebook meta tags, og title og image, social media tags'
    },
    'twitter-card-generator': {
        action: 'Generate Twitter Card meta tags',
        benefits: 'Optimize X/Twitter shares',
        useCase: 'social media',
        keywords: 'twitter card generator free, generate twitter cards online, twitter meta tags, x card generator, twitter card validator'
    },
    'whatsapp-link-generator': {
        action: 'Generate WhatsApp click-to-chat links',
        benefits: 'Custom messages',
        useCase: 'business',
        keywords: 'whatsapp link generator free, generate whatsapp links online, click to chat whatsapp, wa.me link maker, whatsapp chat link'
    },
    'email-validator': {
        action: 'Validate email addresses',
        benefits: 'Check syntax and format',
        useCase: 'forms',
        keywords: 'email validator free, validate email online, email syntax checker, email verifier, check email format'
    },
    'url-opener': {
        action: 'Open multiple URLs in new tabs',
        benefits: 'Bulk link opener',
        useCase: 'research',
        keywords: 'bulk url opener free, open multiple links online, url list opener, link opener, multiple url opener'
    },
    'keyword-density-checker': {
        action: 'Check keyword density',
        benefits: 'Avoid SEO penalties',
        useCase: 'SEO optimization',
        keywords: 'keyword density checker free, check keyword stuffing, seo text analyzer, word frequency counter, keyword optimizer tool'
    }
};

// Generate SEO content for a tool
function generateSEOContent(tool, category) {
    const toolData = TOOL_SEO_DATA[tool.slug] || {
        action: `Use ${tool.name}`,
        benefits: 'Fast and secure processing',
        useCase: 'daily tasks',
        keywords: `${tool.slug}, free ${tool.name.toLowerCase()}, ${tool.name.toLowerCase()} tool`
    };

    const pattern = SEO_PATTERNS[category] || SEO_PATTERNS['utility'];
    
    const title = pattern.titleTemplate
        .replace('{name}', tool.name)
        .replace('{action}', toolData.action)
        .replace('{metric}', tool.name)
        .replace('{type}', tool.name.toLowerCase());

    const description = pattern.descriptionTemplate
        .replace('{action}', toolData.action)
        .replace('{benefits}', toolData.benefits)
        .replace('{useCase}', toolData.useCase)
        .replace('{metric}', tool.name)
        .replace('{type}', tool.name.toLowerCase());

    const keywords = toolData.keywords || pattern.keywordsTemplate
        .replace('{keywords}', `${tool.slug}, ${tool.name.toLowerCase()}`)
        .replace('{name}', tool.name.toLowerCase())
        .replace('{action}', toolData.action)
        .replace('{type}', tool.name.toLowerCase());

    const h1 = `${tool.name} Free${category === 'image' ? ' Online' : ''}: ${toolData.action}`;

    return { title, description, keywords, h1 };
}

// Translate SEO content to target language
function translateSEOContent(seoContent, lang) {
    if (lang === 'en') return seoContent;
    
    const translations = LANGUAGE_TRANSLATIONS[lang] || {};
    
    let translated = { ...seoContent };
    
    // Simple translation (in production, use proper translation API)
    Object.keys(translations).forEach(key => {
        const regex = new RegExp(key, 'gi');
        translated.title = translated.title.replace(regex, translations[key]);
        translated.description = translated.description.replace(regex, translations[key]);
        translated.h1 = translated.h1.replace(regex, translations[key]);
    });
    
    return translated;
}

// Main function
function main() {
    console.log('🚀 Starting SEO Optimization...\n');
    
    // Read tools
    const toolsPath = path.join(__dirname, '../lib/tools.ts');
    const toolsContent = fs.readFileSync(toolsPath, 'utf8');
    
    // Extract tools - improved regex to match in correct order
    const tools = [];
    // Match each tool object more accurately
    const toolBlocks = toolsContent.match(/\{[^}]*slug:\s*'[^']+',[\s\S]*?\}/g) || [];
    
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
    
    console.log(`📊 Found ${tools.length} tools to optimize\n`);
    
    // Generate SEO for each tool
    const seoResults = {};
    tools.forEach(tool => {
        const seo = generateSEOContent(tool, tool.category);
        seoResults[tool.slug] = {
            ...seo,
            category: tool.category,
            name: tool.name
        };
    });
    
    // Write results to JSON file for review
    const outputPath = path.join(__dirname, '../seo-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(seoResults, null, 2));
    
    console.log(`✅ Generated SEO content for ${tools.length} tools`);
    console.log(`📝 Review SEO content in: ${outputPath}\n`);
    console.log('📋 Next Steps:');
    console.log('1. Review seo-output.json');
    console.log('2. Run: node scripts/apply-seo.js to apply to files');
    console.log('3. Or manually update lib/seo.ts and messages/*.json\n');
}

if (require.main === module) {
    main();
}

module.exports = { generateSEOContent, translateSEOContent };

