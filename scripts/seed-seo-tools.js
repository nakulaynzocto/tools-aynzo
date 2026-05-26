const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tools-aynzo';
const Schema = new mongoose.Schema({
  toolSlug:{type:String,required:true},locale:{type:String,required:true},
  seoTitle:{type:String,required:true},seoDescription:{type:String,required:true},
  seoKeywords:{type:[String],default:[]},pageH1:{type:String},
  contentBody:{type:String},faq:[{question:String,answer:String}]
},{timestamps:true});
Schema.index({toolSlug:1,locale:1},{unique:true});
const ToolSEO = mongoose.models.ToolSEO||mongoose.model('ToolSEO',Schema);

const data = [
{
  toolSlug:'meta-tag-generator',locale:'en',
  seoTitle:'Meta Tag Generator – Create SEO-Optimized Meta Tags Free',
  seoDescription:'Generate professional title, description, and keyword meta tags for your website instantly. Improve Google rankings and click-through rates with perfectly crafted SEO meta tags.',
  pageH1:'Free Meta Tag Generator – Boost Your Website SEO Instantly',
  seoKeywords:['meta tag generator','seo meta tags','meta description generator','meta title generator','website meta tags','html meta tags','create meta tags','meta tags for seo','free meta tag tool','og meta tags','twitter meta tags','meta keyword generator','meta tag creator','seo title generator','meta tags online','generate meta tags','meta tag builder','html head tags','seo meta description','meta tag checker'],
  contentBody:`## Meta Tag Generator – The Foundation of On-Page SEO

Meta tags are invisible HTML elements that tell search engines and social platforms what your page is about. They are the single most impactful on-page SEO element you can control — affecting your Google ranking, click-through rate, and social media previews.

### The 3 Critical Meta Tags

**1. Title Tag** (\`<title>\`)
- Maximum 60 characters
- Most important ranking signal after content
- Appears as the blue link in Google results
- Include your primary keyword near the beginning

**2. Meta Description** (\`<meta name="description"\`)
- Maximum 155-160 characters
- Does NOT directly affect rankings but dramatically impacts CTR
- Write it like ad copy — make people want to click
- Include a call-to-action and your keyword

**3. Meta Keywords** (\`<meta name="keywords"\`)
- Ignored by Google, but used by some smaller search engines
- Still useful for internal site search systems

### How to Use This Meta Tag Generator

1. Enter your page title (include your primary keyword)
2. Write a compelling meta description (aim for 150-155 chars)
3. Add 5-10 relevant keywords
4. Click **Generate** to get the complete HTML code
5. Paste it inside the \`<head>\` section of your page

### Pro Tips for Higher CTR

- Use numbers in titles: "7 Ways to..." performs 36% better
- Add the current year to date-sensitive content titles
- Use power words: "Free", "Ultimate", "Proven", "Instant"
- Match meta description to the page's actual content to reduce bounce rate`,
  faq:[
    {question:'Do meta keywords still matter for SEO?',answer:'Google has ignored meta keywords since 2009. However, meta title and meta description tags remain critical ranking and CTR factors.'},
    {question:'What is the ideal meta description length?',answer:'Keep meta descriptions between 150-160 characters. Google truncates anything longer, cutting off your message in search results.'},
    {question:'Can I use the same meta tags on multiple pages?',answer:'No. Duplicate meta tags confuse search engines and reduce each page\'s ranking potential. Every page should have unique title and description tags.'},
    {question:'How quickly do meta tag changes affect Google rankings?',answer:'Google re-crawls most pages within 1-7 days. Changes to meta tags can reflect in search results within days to a few weeks.'},
    {question:'Is this tool free?',answer:'Yes, 100% free. Generate unlimited meta tags with no account required.'},
  ]
},
{
  toolSlug:'open-graph-generator',locale:'en',
  seoTitle:'Open Graph Meta Tag Generator – Optimize Links for Social Sharing',
  seoDescription:'Generate OG meta tags for Facebook, LinkedIn, and more. Control how your website appears when shared on social media with custom titles, descriptions, and images.',
  pageH1:'Open Graph Generator – Control Your Social Media Link Previews',
  seoKeywords:['open graph generator','og meta tags','facebook meta tags','open graph tags','og tags generator','social sharing meta tags','open graph image','og title generator','og description','facebook link preview','linkedin meta tags','social media meta tags','og tag creator','open graph protocol','website preview tags','og image size','facebook sharing tags','opengraph generator','website social preview','og tag builder'],
  contentBody:`## Open Graph Meta Tag Generator – Perfect Social Media Previews

When someone shares your website on Facebook, LinkedIn, or WhatsApp, what they see is controlled by **Open Graph (OG) meta tags**. Without them, social platforms guess what image, title, and description to show — often getting it wrong.

### What Are Open Graph Tags?

Open Graph is a protocol created by Facebook that standardizes how URLs are displayed when shared on social media. The key OG tags are:

- \`og:title\` — Headline shown on the card (max 95 chars)
- \`og:description\` — Supporting text (max 200 chars)  
- \`og:image\` — Thumbnail image (recommended: 1200×630px)
- \`og:url\` — Canonical URL of the page
- \`og:type\` — Content type (website, article, video, etc.)

### Why OG Tags Are Critical for Traffic

Studies show that content with optimized OG images gets **3x more clicks** on social platforms than links without them. A compelling image + title can mean the difference between a link getting ignored or going viral.

### Required Image Specifications

| Platform | Recommended Size | Aspect Ratio |
|---|---|---|
| Facebook | 1200×630px | 1.91:1 |
| LinkedIn | 1200×627px | 1.91:1 |
| Twitter | 1200×675px | 16:9 |

### How to Generate OG Tags

1. Enter your page title, description, and canonical URL
2. Provide your OG image URL (hosted publicly)
3. Select content type (website, article, etc.)
4. Click **Generate** and copy the HTML
5. Paste inside your page's \`<head>\` tag

Use the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to preview and refresh your OG tags after publishing.`,
  faq:[
    {question:'What image size should I use for Open Graph?',answer:'Use 1200×630 pixels (1.91:1 ratio) for best results across Facebook and LinkedIn. Minimum recommended is 600×315px.'},
    {question:'Do Open Graph tags affect SEO rankings?',answer:'Not directly. But they improve social click-through rates, which drives traffic that indirectly signals page quality to search engines.'},
    {question:'What happens if I don\'t have OG tags?',answer:'Social platforms will auto-select a random image and use the page title tag. Results are often broken, ugly previews that deter clicks.'},
    {question:'Are OG tags the same as Twitter Card tags?',answer:'No. Twitter uses its own meta tags (twitter:card, twitter:title, etc.). However, Twitter will fall back to OG tags if Twitter Card tags are missing.'},
    {question:'Is this Open Graph generator free?',answer:'Yes. Generate complete OG tag HTML code for free with no login required.'},
  ]
},
{
  toolSlug:'twitter-card-generator',locale:'en',
  seoTitle:'Twitter Card Generator – Create Rich Media Twitter/X Preview Tags',
  seoDescription:'Generate Twitter Card meta tags to control how your links appear on Twitter/X. Get summary cards, large image cards, and app cards for maximum engagement.',
  pageH1:'Twitter Card Generator – Boost Engagement on Twitter/X',
  seoKeywords:['twitter card generator','twitter meta tags','twitter card tags','x card generator','twitter summary card','twitter large image card','twitter player card','twitter app card','twitter og tags','twitter link preview','twitter share preview','social media preview tags','twitter card creator','twitter card html','twitter card image size','twitter card title','tweet preview generator','twitter card validator','x meta tags','twitter card builder'],
  contentBody:`## Twitter Card Generator – Stand Out in Every Tweet

**Twitter Cards** transform plain links into rich media previews with images, titles, and descriptions. Without Twitter Card meta tags, your shared URLs appear as plain text — missing the visual impact that drives clicks.

### Types of Twitter Cards

| Card Type | Best For | Image Size |
|---|---|---|
| Summary | Blog posts, articles | 120×120px minimum |
| Summary Large Image | Landing pages, news | 1200×675px (16:9) |
| App | Mobile app promotion | App store icon |
| Player | Video/audio content | Varies |

The **Summary Large Image** card is the most effective for web content — it occupies significantly more space in the feed.

### Essential Twitter Card Tags

\`\`\`html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourusername">
<meta name="twitter:title" content="Your Page Title">
<meta name="twitter:description" content="Your description here">
<meta name="twitter:image" content="https://yourdomain.com/image.jpg">
\`\`\`

### Best Practices

- Twitter title max: **70 characters** (truncated after)
- Twitter description max: **200 characters**
- Image must be publicly accessible (no login required)
- Use HTTPS image URLs — HTTP images are blocked
- Validate your cards using the [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### How to Generate Your Twitter Card Tags

1. Select card type (Summary Large Image recommended)
2. Add your Twitter username, title, and description
3. Enter a public image URL
4. Copy the generated HTML and paste into your \`<head>\``,
  faq:[
    {question:'What is the best Twitter Card type for blog posts?',answer:'Summary Large Image is the best choice for most content. It shows a full-width image preview that dramatically increases visibility and click rates.'},
    {question:'Does Twitter Card affect SEO?',answer:'Not directly for search rankings, but Twitter Cards increase social engagement and traffic, which are indirect positive signals for SEO.'},
    {question:'What image dimensions does Twitter Card need?',answer:'For Summary Large Image: 1200×675px (16:9 ratio). Minimum 600×335px. Maximum file size 5MB. JPG, PNG, WEBP, or GIF formats.'},
    {question:'Do I need both OG tags and Twitter Card tags?',answer:'Twitter falls back to OG tags if Twitter Card tags are missing. But having dedicated Twitter Card tags gives you full control over the Twitter preview.'},
    {question:'Is this Twitter Card generator free?',answer:'Yes, completely free. Generate your Twitter Card HTML instantly with no registration needed.'},
  ]
},
{
  toolSlug:'robots-txt-generator',locale:'en',
  seoTitle:'Robots.txt Generator – Control Search Engine Crawler Access Free',
  seoDescription:'Create a professional robots.txt file for your website. Block bad bots, protect admin pages, and guide search engines to crawl your most important content.',
  pageH1:'Robots.txt Generator – Guide Search Bots to Your Best Content',
  seoKeywords:['robots txt generator','robots.txt creator','robots txt file','disallow robots txt','crawl directives','search engine crawler','block bots robots txt','robots txt sitemap','googlebot disallow','robots txt rules','create robots txt','robots txt maker','website crawler control','seo robots txt','robots txt allow','user agent robots','robots txt builder','crawl budget optimization','robots txt tester','noindex robots txt'],
  contentBody:`## Robots.txt Generator – Master Your Site's Crawl Budget

A **robots.txt** file is a simple text file placed at your website's root that tells search engine crawlers which pages they can and cannot access. It is one of the most fundamental technical SEO tools available to webmasters.

### Why Robots.txt Matters for SEO

Search engines have a **crawl budget** — a limited number of pages they will crawl on your site per day. Wasting crawl budget on admin pages, duplicate content, or low-value URLs means important pages get crawled less frequently.

### Common Robots.txt Use Cases

**Block admin/internal pages:**
\`\`\`
User-agent: *
Disallow: /admin/
Disallow: /login/
Disallow: /wp-admin/
\`\`\`

**Block specific bots (e.g., AI scrapers):**
\`\`\`
User-agent: GPTBot
Disallow: /
\`\`\`

**Allow all crawlers everywhere:**
\`\`\`
User-agent: *
Allow: /
\`\`\`

**Add your sitemap location:**
\`\`\`
Sitemap: https://yourdomain.com/sitemap.xml
\`\`\`

### Critical Rules to Follow

- Place robots.txt at exactly: \`https://yourdomain.com/robots.txt\`
- A wrong robots.txt can accidentally block your entire site from Google
- Robots.txt is a **suggestion**, not a command — malicious bots ignore it
- Use \`noindex\` meta tags for pages you want indexed control over, not robots.txt
- Always add your sitemap URL at the bottom

### How to Generate Your Robots.txt

1. Select which bots to allow or block
2. Add any disallowed URL paths
3. Enter your sitemap URL
4. Click **Generate** and download your file
5. Upload to your site's root directory`,
  faq:[
    {question:'Should I block Googlebot in robots.txt?',answer:'Never block Googlebot unless you want your entire site removed from Google search results. Only block paths you genuinely do not want indexed.'},
    {question:'Does robots.txt prevent pages from appearing in Google?',answer:'Robots.txt prevents crawling but NOT indexing. If other sites link to a blocked URL, Google can still index it. Use noindex meta tags to prevent indexing.'},
    {question:'Where should the robots.txt file be placed?',answer:'Always at the root of your domain: https://yourdomain.com/robots.txt. It cannot be in a subdirectory.'},
    {question:'Can robots.txt improve SEO?',answer:'Yes. By blocking low-value pages, you direct crawl budget to your important content, helping Google discover and rank your best pages faster.'},
    {question:'Is this robots.txt generator free?',answer:'Yes. Generate your robots.txt file instantly for free with no account needed.'},
  ]
},
{
  toolSlug:'xml-sitemap-generator',locale:'en',
  seoTitle:'XML Sitemap Generator – Help Google Index Your Website Faster',
  seoDescription:'Generate a complete XML sitemap for your website online. Submit it to Google Search Console and Bing Webmaster Tools to accelerate indexing. Free and instant.',
  pageH1:'XML Sitemap Generator – Get All Your Pages Indexed by Google',
  seoKeywords:['xml sitemap generator','sitemap.xml creator','website sitemap generator','google sitemap generator','sitemap xml online','create xml sitemap','sitemap generator free','sitemap builder','sitemap xml maker','submit sitemap google','sitemap search engine','sitemap url list','generate sitemap online','sitemap for seo','xml sitemap tool','sitemap.xml generator','site crawl sitemap','news sitemap generator','image sitemap xml','video sitemap xml'],
  contentBody:`## XML Sitemap Generator – Accelerate Your Google Indexing

An **XML sitemap** is a structured file that lists all the important URLs on your website. It tells search engines exactly what pages exist, when they were last updated, and how important each page is — dramatically speeding up indexing.

### Why You Need an XML Sitemap

Without a sitemap, search engines discover your pages only through links. New websites, pages with few backlinks, or frequently updated sites can wait weeks to be crawled. A sitemap eliminates this delay.

### What a Sitemap Entry Looks Like

\`\`\`xml
<url>
  <loc>https://yourdomain.com/page</loc>
  <lastmod>2024-01-15</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
\`\`\`

### Priority Guidelines

| Page Type | Recommended Priority |
|---|---|
| Homepage | 1.0 |
| Main category pages | 0.8 |
| Individual blog posts | 0.6 |
| Tag/archive pages | 0.4 |

### Change Frequency Values

- **always** — Changes on every visit (live dashboards)
- **daily** — News sites, blogs published daily
- **weekly** — Regularly updated content
- **monthly** — Mostly static pages
- **yearly** — Legal, about pages

### How to Submit Your Sitemap

1. Generate and download your \`sitemap.xml\`
2. Upload it to your website root
3. Submit URL to **Google Search Console** → Sitemaps
4. Submit to **Bing Webmaster Tools** → Sitemaps
5. Add the sitemap URL to your robots.txt file`,
  faq:[
    {question:'How many URLs can an XML sitemap contain?',answer:'A single sitemap file can contain up to 50,000 URLs and must be under 50MB. For larger sites, use a sitemap index file linking to multiple sitemaps.'},
    {question:'Do I need a sitemap if my site already has good backlinks?',answer:'Yes. Even well-linked sites benefit from sitemaps, especially for new pages, updated content, and pages deep within your site structure.'},
    {question:'How often should I update my sitemap?',answer:'Update it whenever you add or remove pages. For CMS platforms like WordPress, plugins like Yoast automatically update your sitemap continuously.'},
    {question:'Will submitting a sitemap guarantee my pages are indexed?',answer:'No. A sitemap is a request, not a guarantee. Google decides what to index based on quality signals. But it significantly improves the speed of discovery.'},
    {question:'Is this XML sitemap generator free?',answer:'Yes, completely free. Generate your sitemap instantly and download it as a ready-to-upload XML file.'},
  ]
},
{
  toolSlug:'keyword-density-checker',locale:'en',
  seoTitle:'Keyword Density Checker – Analyze SEO Keyword Usage Free',
  seoDescription:'Check the keyword density of any content to avoid over-optimization penalties. Find the perfect keyword frequency balance for top Google rankings. Free online tool.',
  pageH1:'Keyword Density Checker – Optimize Content Without Over-Stuffing',
  seoKeywords:['keyword density checker','keyword frequency analyzer','seo keyword density','keyword density tool','check keyword density','keyword stuffing checker','content keyword analysis','keyword density calculator','seo content analyzer','keyword percentage checker','on-page seo checker','text keyword counter','keyword occurrence checker','seo text analyzer','keyword usage checker','content optimization tool','keyword density online','keyword frequency tool','seo writing tool','keyword saturation checker'],
  contentBody:`## Keyword Density Checker – Find the Perfect SEO Content Balance

**Keyword density** is the percentage of times a target keyword appears in your content relative to the total word count. Getting this balance right is critical — too little and you miss ranking signals; too much and Google penalizes you for keyword stuffing.

### The Ideal Keyword Density

Modern SEO best practices suggest:
- **Primary keyword**: 1–2% density
- **LSI/related keywords**: 0.5–1% each
- **Natural variation**: Use synonyms and related terms

For a 1000-word article, your primary keyword should appear roughly **10–20 times**.

### Formula

\`\`\`
Keyword Density = (Keyword Occurrences ÷ Total Words) × 100
\`\`\`

**Example:** A keyword appearing 15 times in a 1000-word article = 1.5% density ✅

### Signs of Keyword Stuffing (Avoid These)

- Same phrase repeated awkwardly every paragraph
- Keywords forced into unnatural sentence structures
- Density exceeding 3-4% for any single term
- Using keywords in image alt text, headings, and content all at maximum density simultaneously

### How to Use This Tool

1. Paste your full article or content text
2. Enter the keyword(s) you want to analyze
3. Click **Analyze**
4. Review density percentage and occurrence count
5. Edit your content to reach the 1-2% sweet spot

### Beyond Density: Semantic SEO

Google's algorithm now understands **semantic context**. Focus on:
- Topic coverage (do you cover all aspects of the topic?)
- Natural language variation (synonyms, related phrases)
- User intent matching (does your content answer what searchers want?)`,
  faq:[
    {question:'What is the ideal keyword density for SEO?',answer:'Most SEO experts recommend 1-2% for your primary keyword. Anything above 3% risks triggering keyword stuffing penalties from Google.'},
    {question:'Does keyword density still matter in 2024?',answer:'Yes, but less than before. Google now focuses more on semantic relevance and topic coverage. Natural use of keywords matters more than hitting a specific percentage.'},
    {question:'What is keyword stuffing and is it penalized?',answer:'Keyword stuffing is unnaturally repeating keywords to manipulate rankings. Google\'s algorithms detect and penalize it with lower rankings or manual actions.'},
    {question:'Should I check keyword density for every page?',answer:'Check when creating new content and when auditing underperforming pages. It helps identify if over-optimization might be causing ranking issues.'},
    {question:'Is this keyword density checker free?',answer:'Yes. Analyze unlimited content for keyword density completely free with no registration required.'},
  ]
},
];


const data2 = [
{
  toolSlug:'keyword-cleaner',locale:'en',
  seoTitle:'Keyword Cleaner – Remove Duplicates & Format Keyword Lists Free',
  seoDescription:'Clean and deduplicate messy keyword lists instantly. Remove duplicates, blank lines, and unwanted characters from PPC and SEO keyword lists. Free online tool.',
  pageH1:'Keyword Cleaner – Deduplicate & Organize Your SEO Keyword Lists',
  seoKeywords:['keyword cleaner','keyword deduplicator','remove duplicate keywords','clean keyword list','keyword list formatter','ppc keyword cleaner','keyword organizer','seo keyword tool','deduplicate keyword list','keyword list cleaner online','remove blank lines keywords','keyword sorter','google ads keyword cleaner','keyword list scrubber','clean adwords keywords','format keyword list','keyword cleanup tool','keyword list processor','duplicate keyword remover','keyword list optimizer'],
  contentBody:`## Keyword Cleaner – Streamline Your SEO & PPC Campaigns

Managing keyword lists is tedious. Whether you're building a Google Ads campaign or doing SEO research, raw keyword exports are messy — full of duplicates, extra spaces, inconsistent casing, and blank lines. The **Keyword Cleaner** fixes all of this in seconds.

### What the Keyword Cleaner Does

- ✅ Removes duplicate keywords
- ✅ Eliminates blank/empty lines
- ✅ Trims leading and trailing whitespace
- ✅ Normalizes text casing (UPPER, lower, Title Case)
- ✅ Removes special characters and symbols
- ✅ Sorts alphabetically or by length
- ✅ Counts final keyword list size

### Why Clean Keywords Matter

**For Google Ads / PPC:**
Duplicate keywords in the same ad group waste budget by creating internal bid competition. Clean lists ensure each keyword is unique and properly structured.

**For SEO:**
When building content clusters or keyword maps, duplicates create confusion and dilute your strategy. A clean list gives a clear picture of your actual keyword coverage.

### Common Keyword List Sources

- Google Keyword Planner exports
- Ahrefs / SEMrush / Moz exports
- Client-provided keyword spreadsheets
- Combined lists from multiple tools

### How to Use the Keyword Cleaner

1. Paste your raw keyword list (one per line or comma-separated)
2. Select cleaning options (remove duplicates, sort, normalize case)
3. Click **Clean Keywords**
4. Copy your cleaned list directly into your SEO or ads platform`,
  faq:[
    {question:'Can this tool handle large keyword lists?',answer:'Yes. The keyword cleaner handles thousands of keywords at once. Paste your full export and get a cleaned list instantly.'},
    {question:'Does it preserve keyword match types for Google Ads?',answer:'Yes. Keywords with brackets [exact], quotes "phrase", and +broad +match +modifiers are preserved intact — only true duplicates within the same match type are removed.'},
    {question:'What casing formats are supported?',answer:'The tool supports converting all keywords to lowercase, UPPERCASE, or Title Case with a single click.'},
    {question:'Can I sort keywords alphabetically?',answer:'Yes. Sort ascending or descending alphabetically or by keyword length to organize your list efficiently.'},
    {question:'Is this keyword cleaner free?',answer:'Yes, 100% free with no limits and no account required.'},
  ]
},
{
  toolSlug:'long-tail-keyword-generator',locale:'en',
  seoTitle:'Long Tail Keyword Generator – Find Low-Competition SEO Keywords',
  seoDescription:'Generate hundreds of long-tail keyword variations from any seed keyword. Target specific user intent and rank faster with low-competition phrases. Free SEO tool.',
  pageH1:'Long Tail Keyword Generator – Discover High-Converting Niche Keywords',
  seoKeywords:['long tail keyword generator','long tail keywords','keyword variations generator','seed keyword tool','low competition keywords','niche keyword generator','keyword expansion tool','seo keyword ideas','long tail keyword finder','question keywords generator','keyword suggestion tool','content keyword ideas','keyword research tool free','semantic keyword generator','blog keyword generator','keyword permutation tool','long tail seo strategy','buyer intent keywords','keyword brainstorm tool','keyword phrase generator'],
  contentBody:`## Long Tail Keyword Generator – The Secret to Ranking Faster

**Long-tail keywords** are specific, multi-word search phrases (typically 3+ words) with lower search volume but much higher conversion rates and less competition. They are the #1 strategy for new websites to start ranking quickly in Google.

### Short-Tail vs Long-Tail Keywords

| Type | Example | Volume | Competition | Conversion |
|---|---|---|---|---|
| Short-tail | "shoes" | Very High | Extremely High | Low |
| Mid-tail | "running shoes" | High | High | Medium |
| Long-tail | "best trail running shoes for flat feet" | Low | Low | Very High |

### Why Long-Tail Keywords Win

- **70% of all Google searches** are long-tail queries
- Searchers using long-tail terms are further down the buying funnel
- New websites can rank on page 1 within weeks
- Voice search and AI search are almost entirely long-tail

### Types of Long-Tail Keywords Generated

- **Question-based**: "how to", "what is", "why does", "when should"
- **Comparison-based**: "X vs Y", "best X for Y"
- **Location-based**: "X near me", "X in [city]"
- **Buyer intent**: "buy X online", "X price", "X review"
- **Modifier-based**: "best", "cheap", "free", "professional"

### How to Use This Generator

1. Enter your seed keyword (e.g., "coffee maker")
2. Select keyword types to generate (questions, comparisons, etc.)
3. Click **Generate**
4. Filter and export your keyword list
5. Use top keywords as blog post titles or content section headings`,
  faq:[
    {question:'How many long-tail keywords should I target per page?',answer:'Target one primary long-tail keyword per page. Include 3-5 related long-tail variations naturally in the content to capture semantic search traffic.'},
    {question:'Are long-tail keywords worth targeting?',answer:'Absolutely. Long-tail keywords convert 2.5x better than generic terms and are far easier to rank for, making them ideal for content strategies at any level.'},
    {question:'What is the best long-tail keyword length?',answer:'4-6 word phrases typically offer the best balance of specificity and search volume. Longer phrases have almost no competition but very limited search volume.'},
    {question:'Can I use these keywords for Google Ads?',answer:'Yes. Long-tail keywords are excellent for PPC campaigns — they have lower CPCs (cost per click) and higher conversion rates than broad keywords.'},
    {question:'Is this long tail keyword generator free?',answer:'Yes, completely free to use with no account or registration required.'},
  ]
},
{
  toolSlug:'slug-generator',locale:'en',
  seoTitle:'URL Slug Generator – Create Clean SEO-Friendly URL Paths Free',
  seoDescription:'Convert any title or text into an SEO-optimized URL slug instantly. Remove special characters, spaces, and create clean, readable URL structures for better rankings.',
  pageH1:'URL Slug Generator – Build Clean, SEO-Friendly Permalinks',
  seoKeywords:['url slug generator','seo url generator','permalink generator','clean url creator','slug maker','url friendly text','convert title to url','seo friendly url','url slug creator','slug converter','wordpress slug generator','blog post url generator','url path generator','url sanitizer','url cleaner tool','create url slug','url string generator','page url generator','seo permalink tool','url slug formatter'],
  contentBody:`## URL Slug Generator – Build Perfect SEO-Friendly URLs

A **URL slug** is the part of a web address that identifies a specific page — the readable portion after your domain name (e.g., \`/your-page-title-here\`). A well-crafted slug improves SEO, user experience, and the shareability of your links.

### What Makes a Good URL Slug?

**Good slug:** \`/best-keyword-research-tools\`
**Bad slug:** \`/page?id=4821&cat=seo&ref=nav\`

Google explicitly recommends clean, descriptive URLs as a ranking factor.

### URL Slug Best Practices

- ✅ Use hyphens (-) to separate words, not underscores (_)
- ✅ Keep slugs short: 3-5 words maximum
- ✅ Include your primary keyword
- ✅ Use all lowercase letters
- ✅ Remove stop words (a, the, and, of, for)
- ✅ Avoid special characters, spaces, and symbols
- ❌ Never use uppercase letters or spaces

### Examples of Slug Optimization

| Original Title | Optimized Slug |
|---|---|
| "The 10 Best Ways to Lose Weight Fast" | \`/best-ways-lose-weight\` |
| "SEO Tips for Beginners in 2024" | \`/seo-tips-beginners\` |
| "How to Cook Perfect Pasta?" | \`/how-to-cook-pasta\` |

### How to Generate Your URL Slug

1. Paste your page title or text
2. The tool automatically converts to lowercase, removes special characters, and hyphenates words
3. Copy the generated slug
4. Use it as your page URL, WordPress permalink, or blog post path`,
  faq:[
    {question:'Should I use hyphens or underscores in URL slugs?',answer:'Always use hyphens. Google treats hyphens as word separators. Underscores are treated as word joiners, so "seo_tips" is read as "seotips" by Google.'},
    {question:'How long should a URL slug be?',answer:'Keep slugs under 60 characters total. Shorter is better for readability and shareability. Remove unnecessary words like "a", "the", "and".'},
    {question:'Should I include keywords in URL slugs?',answer:'Yes. Include your primary keyword in the slug. It is a confirmed (though minor) Google ranking factor and helps users understand the page topic before clicking.'},
    {question:'Can I change a URL slug after publishing?',answer:'You can, but always set up a 301 redirect from the old URL to the new one. Changing URLs without redirects causes 404 errors and lost link equity.'},
    {question:'Is this slug generator free?',answer:'Yes. Generate unlimited SEO-friendly URL slugs completely free with no registration.'},
  ]
},
{
  toolSlug:'google-serp-simulator',locale:'en',
  seoTitle:'Google SERP Simulator – Preview How Your Website Looks in Search Results',
  seoDescription:'See exactly how your title and meta description appear in Google search results before publishing. Optimize for CTR with our real-time SERP preview tool. 100% free.',
  pageH1:'Google SERP Simulator – Preview & Optimize Your Search Result Appearance',
  seoKeywords:['google serp simulator','serp preview tool','google search preview','meta tag preview','seo snippet preview','google result preview','serp snippet generator','search result simulator','title tag preview','meta description preview','google listing preview','seo preview tool','search snippet tool','google search result preview','serp checker tool','ctr optimization tool','snippet preview generator','title length checker','meta description length','google search preview tool'],
  contentBody:`## Google SERP Simulator – Optimize Before You Publish

The **Google SERP Simulator** lets you preview exactly how your page title and meta description will appear in Google search results — before you even publish the page. This is your final quality check for maximum click-through rate (CTR).

### What Is a SERP?

SERP stands for **Search Engine Results Page** — the page Google shows after a user searches. Your website's appearance in the SERP consists of:

1. **Title Tag** (blue clickable link) — max ~60 characters
2. **URL** (green breadcrumb path) — shown below title
3. **Meta Description** (gray description text) — max ~155 characters

### Why Previewing Before Publishing Matters

- Google truncates titles and descriptions that are too long
- Truncated titles look unprofessional and reduce CTR
- A compelling meta description can increase CTR by 30%+
- You cannot undo a published URL with poor first impressions

### CTR Optimization Tips

**For the Title:**
- Include the primary keyword in the first 30 characters
- Use numbers, brackets, or power words: [Free], (2024), "Ultimate"
- Create curiosity or promise a clear benefit

**For the Meta Description:**
- Write like an ad — what makes your page the best result?
- Include a CTA: "Learn how...", "Get your free...", "Discover..."
- Use the keyword naturally (Google bolds matching terms)

### Character Limits at a Glance

| Element | Safe Length | Max Length |
|---|---|---|
| Title tag | 55 characters | ~60 characters |
| Meta description | 145 characters | ~155 characters |
| URL path | Under 60 characters | No hard limit |`,
  faq:[
    {question:'What is the maximum title tag length for Google?',answer:'Google typically displays up to 60 characters for title tags. Beyond that, the title is truncated with "..." Keep titles under 55-60 characters for safety.'},
    {question:'Can I increase my CTR by optimizing title and description?',answer:'Yes. Studies show that compelling meta descriptions and titles can increase organic CTR by 20-50%. This directly impacts traffic without changing rankings.'},
    {question:'Does Google always use my meta description?',answer:'No. Google rewrites meta descriptions about 62% of the time, especially if it finds a better match in your page content for the user\'s query.'},
    {question:'Does the SERP preview tool use real Google data?',answer:'This is a simulator showing pixel-accurate previews. Actual Google results may vary slightly based on device, query, and personalization factors.'},
    {question:'Is the Google SERP simulator free?',answer:'Yes. Preview your search result snippet unlimited times for free with no account required.'},
  ]
},
{
  toolSlug:'htaccess-redirect-generator',locale:'en',
  seoTitle:'.htaccess Redirect Generator – Create 301 & 302 Redirect Rules Free',
  seoDescription:'Generate .htaccess redirect code for 301 permanent and 302 temporary redirects. Protect SEO link equity when changing URLs. Free, instant, no server knowledge needed.',
  pageH1:'.htaccess Redirect Generator – Preserve SEO When Changing URLs',
  seoKeywords:['htaccess redirect generator','301 redirect generator','302 redirect generator','htaccess redirect code','apache redirect generator','url redirect generator','301 permanent redirect','302 temporary redirect','website redirect tool','seo redirect generator','htaccess code generator','redirect htaccess rules','create 301 redirect','url forwarding generator','page redirect code','htaccess rewrite rule','apache rewrite generator','redirect old url','seo url redirect','htaccess url redirect'],
  contentBody:`## .htaccess Redirect Generator – Never Lose SEO Value When Moving Pages

When you change a URL, rename a page, or migrate your website, broken links destroy your SEO. A **301 redirect** passes the original page's link equity and ranking power to the new URL. Our .htaccess Redirect Generator creates the exact Apache server code you need.

### 301 vs 302 Redirects – Which to Use?

| Type | Code | When to Use | SEO Impact |
|---|---|---|---|
| Permanent | 301 | URL changed forever | Passes 90-99% of link equity |
| Temporary | 302 | URL change is temporary | Does NOT pass link equity |

**Always use 301 for:** Page moves, domain migrations, HTTP→HTTPS, www→non-www

**Use 302 for:** A/B testing pages, maintenance redirects, temporary campaigns

### What Is .htaccess?

An **.htaccess** file is a configuration file for Apache web servers (used by most shared hosting). It controls server behavior including redirects, URL rewrites, access control, and caching.

### Generated Code Example

\`\`\`apache
# 301 Permanent Redirect
Redirect 301 /old-page/ https://yourdomain.com/new-page/

# Redirect entire old domain to new domain
Redirect 301 / https://newdomain.com/
\`\`\`

### How to Use Your Generated .htaccess Code

1. Generate your redirect rule with old and new URLs
2. Open your existing \`.htaccess\` file (or create one at root)
3. Paste the redirect code at the top of the file
4. Save and upload to your server
5. Test using a redirect checker tool`,
  faq:[
    {question:'Will a 301 redirect pass all my SEO link equity?',answer:'A 301 redirect passes approximately 90-99% of the original page\'s link equity (PageRank) to the new URL. Some minor loss is normal but significantly better than broken links.'},
    {question:'How do I access the .htaccess file?',answer:'Access it via FTP/SFTP, your hosting control panel\'s File Manager, or SSH. It\'s hidden by default — enable "show hidden files" in your FTP client.'},
    {question:'Does my server support .htaccess files?',answer:'.htaccess works on Apache web servers. NGINX servers use a different configuration method. Check with your host if you\'re unsure.'},
    {question:'Can I redirect an entire old domain to a new domain?',answer:'Yes. Use: Redirect 301 / https://newdomain.com/ — This sends all traffic from the old domain to the new domain while preserving the URL path.'},
    {question:'Is this .htaccess redirect generator free?',answer:'Yes, 100% free. Generate your redirect code instantly with no login required.'},
  ]
},
];

// Merge both data arrays
const allData = [...data, ...data2];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    let ok=0, fail=0;
    for(const d of allData){
      try{
        await ToolSEO.findOneAndUpdate(
          {toolSlug:d.toolSlug,locale:d.locale},
          {$set:d},
          {upsert:true,returnDocument:'after',runValidators:true}
        );
        console.log(`✅ [${d.locale}] ${d.toolSlug}`);
        ok++;
      }catch(e){
        console.error(`❌ ${d.toolSlug}: ${e.message}`);
        fail++;
      }
    }
    console.log(`\n📊 Done! Success: ${ok}, Failed: ${fail}`);
    await mongoose.disconnect();
    process.exit(0);
  }catch(e){
    console.error('❌ DB Error:',e.message);
    process.exit(1);
  }
}
seed();
