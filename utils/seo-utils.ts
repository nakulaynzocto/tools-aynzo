import { tools } from '../lib/tools';

/**
 * Programmatic Metadata Generator
 * Ensures every tool has high-quality, keyword-rich SEO tags even if missing in lib/tools.ts
 */
export function generateProgrammaticMetadata(slug: string, locale: string) {
    const tool = tools.find((t: any) => t.slug === slug);
    if (!tool) return null;

    const name = tool.name;
    const category = tool.category;

    // Localized strings for templates
    const loc: Record<string, any> = {
        en: {
            image: "Free Online Image Converter & Editor",
            pdf: "Convert & Edit PDF Files Free Online",
            text: "Professional Online Text Formatting Tool",
            dev: "Free Developer Utility & Code Formatter",
            sec: "Secure Online Generator & Hashing Tool",
            yt: "Free YouTube Video Growth & SEO Tool",
            seo: "Advanced Web & SEO Analysis Tool",
            fallback: "Free Online Utility Tool",
            desc_img: `Use our free online ${name} to process your photos instantly. 100% private.`,
            desc_gen: `Professional online ${name} tool. Fast, secure, and easy to use.`
        },
        hi: {
            image: "फ्री ऑनलाइन इमेज कनवर्टर और एडिटर",
            pdf: "फ्री ऑनलाइन PDF कनवर्ट करें और एडिट करें",
            text: "प्रोफेशनल ऑनलाइन टेक्स्ट फॉर्मेटिंग टूल",
            dev: "फ्री डेवलपर यूटिलिटी और कोड फॉर्मेटिंग",
            sec: "सेफ ऑनलाइन जनरेटर और हैशिंग टूल",
            yt: "फ्री यूट्यूब वीडियो ग्रोथ और SEO टूल",
            seo: "एडवांस्ड वेब और SEO एनालिसिस टूल",
            fallback: "फ्री ऑनलाइन यूटिलिटी टूल",
            desc_img: `अपनी तस्वीरों को तुरंत प्रोसेस करने के लिए हमारे फ्री ऑनलाइन ${name} का उपयोग करें। 100% प्राइवेट।`,
            desc_gen: `प्रोफेशनल ऑनलाइन ${name} टूल। तेज़, सुरक्षित और उपयोग में आसान।`
        },
        es: {
            image: "Convertidor y Editor de Imágenes Online Gratis",
            pdf: "Convertir y Editar Archivos PDF Gratis Online",
            text: "Herramienta Profesional de Formateo de Texto",
            dev: "Utilidad de Desarrollador y Formateador de Código",
            sec: "Generador Online Seguro y Herramienta de Hash",
            yt: "Herramienta Gratuita de Crecimiento y SEO para YouTube",
            seo: "Herramienta Avanzada de Análisis Web y SEO",
            fallback: "Herramienta de Utilidad Online Gratis",
            desc_img: `Utiliza nuestro ${name} online gratuito para procesar tus fotos al instante. 100% privado.`,
            desc_gen: `Herramienta profesional ${name} online. Rápida, segura y fácil de usar.`
        },
        pt: {
            image: "Conversor e Editor de Imagens Online Gratuito",
            pdf: "Converter e Editar Arquivos PDF Online Grátis",
            text: "Ferramenta Profissional de Formatação de Texto",
            dev: "Utilitário de Desenvolvedor e Formatador de Código",
            sec: "Gerador Online Seguro e Ferramenta de Hash",
            yt: "Ferramenta Gratuita de Crescimento e SEO para YouTube",
            seo: "Ferramenta Avançada de Análise Web e SEO",
            fallback: "Ferramenta Utilitária Online Gratuita",
            desc_img: `Use o nosso ${name} online gratuito para processar as suas fotos instantaneamente. 100% privado.`,
            desc_gen: `Ferramenta profissional ${name} online. Rápida, segura e fácil de usar.`
        },
        fr: {
            image: "Convertisseur et Éditeur d'Images en Ligne Gratuit",
            pdf: "Convertir et Modifier des Fichiers PDF en Ligne Gratuitement",
            text: "Outil Professionnel de Formatage de Texte en Ligne",
            dev: "Utilitaire Développeur et Formateur de Code Gratuit",
            sec: "Générateur en Ligne Sécurisé et Outil de Hachage",
            yt: "Outil Gratuit de Croissance et SEO pour YouTube",
            seo: "Outil d'Analyse Web et SEO Avancé",
            fallback: "Outil Utilitaire en Ligne Gratuit",
            desc_img: `Utilisez notre ${name} en ligne gratuit pour traiter vos photos instantanément. 100% privé.`,
            desc_gen: `Outil ${name} en ligne professionnel. Rapide, sécurisé et facile à utiliser.`
        },
        ar: {
            image: "محول ومحرر صور مجاني عبر الإنترنت",
            pdf: "تحويل وتحرير ملفات PDF مجانًا عبر الإنترنت",
            text: "أداة احترافية لتنسيق النصوص عبر الإنترنت",
            dev: "أداة مساعدة للمطورين وتنسيق التعليمات البرمجية المجانية",
            sec: "مولد آمن عبر الإنترنت وأداة تشفير",
            yt: "أداة نمو وسيو يوتيوب مجانية",
            seo: "أداة تحليل ويب وسيو متقدمة",
            fallback: "أداة مساعدة مجانية عبر الإنترنت",
            desc_img: `استخدم أداة ${name} المجانية عبر الإنترنت لمعالجة صورك على الفور. خصوصية 100%.`,
            desc_gen: `أداة ${name} احترافية عبر الإنترنت. سريعة وآمنة وسهلة الاستخدام.`
        },
        de: {
            image: "Kostenloser Online-Bildkonverter & Editor",
            pdf: "PDF-Dateien kostenlos online konvertieren & bearbeiten",
            text: "Professionelles Online-Text-Formatierungstool",
            dev: "Kostenloses Entwickler-Utility & Code-Formatierer",
            sec: "Sicherer Online-Generator & Hashing-Tool",
            yt: "Kostenloses YouTube-Video-Wachstums- & SEO-Tool",
            seo: "Erweitertes Web- & SEO-Analyse-Tool",
            fallback: "Kostenloses Online-Utility-Tool",
            desc_img: `Nutzen Sie unseren kostenlosen Online-${name}, um Ihre Fotos sofort zu bearbeiten. 100 % privat.`,
            desc_gen: `Professionelles Online-${name}-Tool. Schnell, sicher und einfach zu bedienen.`
        },
        ru: {
            image: "Бесплатный онлайн-конвертер и редактор изображений",
            pdf: "Конвертируйте и редактируйте PDF-файлы бесплатно онлайн",
            text: "Профессиональный инструмент для форматирования текста онлайн",
            dev: "Бесплатная утилита для разработчиков и форматирования кода",
            sec: "Безопасный онлайн-генератор и инструмент хеширования",
            yt: "Бесплатный инструмент для роста и SEO на YouTube",
            seo: "Расширенный инструмент для веб-аналитики и SEO",
            fallback: "Бесплатный онлайн-инструмент",
            desc_img: `Используйте наш бесплатный онлайн-${name} для мгновенной обработки ваших фотографий. 100% конфиденциально.`,
            desc_gen: `Профессиональный онлайн-инструмент ${name}. Быстро, безопасно и легко использовать.`
        },
        tr: {
            image: "Ücretsiz Çevrimiçi Resim Dönüştürücü ve Düzenleyici",
            pdf: "PDF Dosyalarını Çevrimiçi Ücretsiz Dönüştürün ve Düzenleyin",
            text: "Profesyonel Çevrimiçi Metin Biçimlendirme Aracı",
            dev: "Ücretsiz Geliştirici Yardımcı Programı ve Kod Biçimlendirici",
            sec: "Güvenli Çevrimiçi Oluşturucu ve Karma Aracı",
            yt: "Ücretsiz YouTube Video Büyüme ve SEO Aracı",
            seo: "Gelişmiş Web ve SEO Analiz Aracı",
            fallback: "Ücretsiz Çevrimiçi Yardımcı Program Aracı",
            desc_img: `Fotoğraflarınızı anında işlemek için ücretsiz çevrimiçi ${name} aracımızı kullanın. %100 özel.`,
            desc_gen: `Profesyonel çevrimiçi ${name} aracı. Hızlı, güvenli ve kullanımı kolay.`
        },
        it: {
            image: "Convertitore e editor di immagini online gratuito",
            pdf: "Converti e modifica file PDF online gratuitamente",
            text: "Strumento professionale di formattazione del testo online",
            dev: "Utility per sviluppatori e formattatore di codice gratuito",
            sec: "Generatore online sicuro e strumento di hashing",
            yt: "Strumento gratuito per la crescita e la SEO di YouTube",
            seo: "Strumento avanzato di analisi Web e SEO",
            fallback: "Strumento di utilità online gratuito",
            desc_img: `Usa il nostro ${name} online gratuito per elaborare istantaneamente le tue foto. 100% privato.`,
            desc_gen: `Strumento professionale ${name} online. Veloce, sicuro e facile da usare.`
        },
        id: {
            image: "Konverter & Editor Gambar Online Gratis",
            pdf: "Konversi & Edit File PDF Gratis Online",
            text: "Alat Pemformatan Teks Online Profesional",
            dev: "Utilitas Pengembang & Pemformat Kode Gratis",
            sec: "Generator Online Aman & Alat Hashing",
            yt: "Alat Pertumbuhan Video & SEO YouTube Gratis",
            seo: "Alat Analisis Web & SEO Tingkat Lanjut",
            fallback: "Alat Utilitas Online Gratis",
            desc_img: `Gunakan ${name} online gratis kami untuk memproses foto Anda secara instan. 100% pribadi.`,
            desc_gen: `Alat ${name} online profesional. Cepat, aman, dan mudah digunakan.`
        },
        ja: {
            image: "無料オンライン画像コンバーター＆エディター",
            pdf: "PDFファイルをオンラインで無料変換＆編集",
            text: "プロフェッショナルオンラインテキスト整形ツール",
            dev: "無料開発者ユーティリティ＆コードフォーマッタ",
            sec: "安全なオンラインジェネレーター＆ハッシュツール",
            yt: "無料YouTube動画成長＆SEOツール",
            seo: "高度なWeb＆SEO分析ツール",
            fallback: "無料オンラインユーティリティツール",
            desc_img: `無料のオンライン${name}を使用して、写真を即座に処理します。100％プライベート。`,
            desc_gen: `プロフェッショナルなオンライン${name}ツール。高速、安全、そして簡単。`
        },
        ko: {
            image: "무료 온라인 이미지 변환기 및 편집기",
            pdf: "PDF 파일 무료 온라인 변환 및 편집",
            text: "전문 온라인 텍스트 서식 도구",
            dev: "무료 개발자 유틸리티 및 코드 포맷터",
            sec: "안전한 온라인 생성기 및 해싱 도구",
            yt: "무료 YouTube 동영상 성장 및 SEO 도구",
            seo: "고급 웹 및 SEO 분석 도구",
            fallback: "무료 온라인 유틸리티 도구",
            desc_img: `무료 온라인 ${name}을 사용하여 사진을 즉시 처리하세요. 100% 개인 정보 보호.`,
            desc_gen: `전문 온라인 ${name} 도구. 빠르고 안전하며 사용하기 쉽습니다.`
        },
        zh: {
            image: "免费在线图片转换器和编辑器",
            pdf: "在线免费转换和编辑 PDF 文件",
            text: "专业在线文本格式化工具",
            dev: "免费开发人员工具和代码格式化程序",
            sec: "安全在线生成器和哈希工具",
            yt: "免费 YouTube 视频增长和 SEO 工具",
            seo: "高级 Web 和 SEO 分析工具",
            fallback: "免费在线公用事业工具",
            desc_img: `使用我们的免费在线 ${name} 立即处理您的照片。100% 私密。`,
            desc_gen: `专业在线 ${name} 工具。快速、安全且易于使用。`
        }
    };

    const l = loc[locale] || loc.en;

    const titles: Record<string, string> = {
        'image': l.image,
        'pdf': l.pdf,
        'text': l.text,
        'developer': l.dev,
        'security': l.sec,
        'youtube': l.yt,
        'seo': l.seo,
    };

    const title = titles[category] || l.fallback;
    const description = category === 'image' ? l.desc_img : l.desc_gen;
    const keywords = `${name.toLowerCase()}, ${l.fallback.toLowerCase()}, ${name.toLowerCase()} ${locale}`;

    return {
        title: `${name} - ${title} | AYNZO`,
        description,
        keywords,
    };
}
