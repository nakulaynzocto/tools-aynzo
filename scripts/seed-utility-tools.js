const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tools-aynzo';
const S = new mongoose.Schema({
  toolSlug:{type:String,required:true},locale:{type:String,required:true},
  seoTitle:{type:String,required:true},seoDescription:{type:String,required:true},
  seoKeywords:{type:[String],default:[]},pageH1:{type:String},
  contentBody:{type:String},faq:[{question:String,answer:String}]
},{timestamps:true});
S.index({toolSlug:1,locale:1},{unique:true});
const ToolSEO = mongoose.models.ToolSEO||mongoose.model('ToolSEO',S);

const data = [
{
  toolSlug:'random-number',locale:'en',
  seoTitle:'Random Number Generator – Pick Random Numbers in Any Range Free',
  seoDescription:'Generate truly random numbers within any custom range instantly. Perfect for lotteries, games, giveaways, research, and unbiased decisions. Free online random number picker.',
  pageH1:'Random Number Generator – Fair, Instant, and Truly Random',
  seoKeywords:['random number generator','random number picker','random number between 1 and 100','random number online','generate random number','lottery number generator','random number selector','random integer generator','free random number','number randomizer','random dice roller','pick random number','random number tool','custom range number generator','random number 1 to 10','true random number','random number for games','random number giveaway','random number research','online random picker'],
  contentBody:`## Random Number Generator – Fair and Unbiased Random Numbers

Whether you're running a giveaway, playing a game, conducting research, or making decisions, our **Random Number Generator** produces truly random numbers using cryptographic entropy — not predictable algorithms.

### What Makes a Number "Truly Random"?

Most programming languages use **pseudo-random number generators (PRNGs)** — algorithms that produce sequences that appear random but are mathematically deterministic. Our tool uses the **Web Crypto API** (\`crypto.getRandomValues()\`) which draws from hardware entropy sources for true randomness.

### Common Uses for Random Number Generators

| Use Case | Example |
|---|---|
| Giveaways | Pick winner from 1–500 entrants |
| Games & RPG | Roll virtual dice (1–6, 1–20) |
| Research | Random sampling from a data set |
| Decisions | Flip a coin (1 or 2) |
| Lottery | Pick 6 numbers from 1–49 |
| Security | Generate PIN codes |

### How to Generate a Random Number

1. Enter your minimum value (e.g., 1)
2. Enter your maximum value (e.g., 100)
3. Click **Generate** 
4. Get your truly random result instantly
5. Click again for a new number

### Generating Multiple Random Numbers

Need several unique numbers? Enable the **bulk mode** to generate multiple non-repeating random numbers — perfect for lottery draws, team selections, or random sampling.

### Fairness and Transparency

Every number in your specified range has an **equal probability** of being selected. There is no weighting, bias, or pattern. Each generation is completely independent of the last.`,
  faq:[
    {question:'Is this random number generator truly random?',answer:'Yes. It uses the Web Crypto API (crypto.getRandomValues) which relies on hardware entropy sources — making it cryptographically random and suitable for security-sensitive applications.'},
    {question:'Can I generate numbers with decimals?',answer:'Yes. Enable the decimal/float option to generate random numbers with decimal places within your specified range.'},
    {question:'Can I generate multiple random numbers at once?',answer:'Yes. Switch to bulk mode and specify how many numbers you need. The tool can generate multiple unique, non-repeating numbers in one click.'},
    {question:'Is this tool suitable for lottery picks?',answer:'Yes. Every number in your range has exactly equal probability of selection, making it fair for giveaways, lottery draws, and random selections.'},
    {question:'Is this random number generator free?',answer:'Yes, 100% free with no registration or limits.'},
  ]
},
{
  toolSlug:'random-string',locale:'en',
  seoTitle:'Random String Generator – Create Unique Text & API Keys Free',
  seoDescription:'Generate secure random strings with custom length and character sets. Create API keys, passwords, tokens, and unique identifiers instantly. Free online string generator.',
  pageH1:'Random String Generator – Secure Tokens and API Keys in One Click',
  seoKeywords:['random string generator','random text generator','api key generator','random token generator','unique string generator','random alphanumeric generator','random character string','password string generator','random key generator','random code generator','random hash string','secure token generator','random id generator','unique token generator','random string maker','generate random string','string randomizer','random text string','alphanumeric generator','random password string'],
  contentBody:`## Random String Generator – Create Tokens, Keys & Unique IDs

A **Random String Generator** creates unpredictable sequences of characters that are essential for API keys, session tokens, encryption keys, unique file names, and test data. Our tool gives you full control over length and character composition.

### Character Set Options

| Option | Characters Included |
|---|---|
| Uppercase | A–Z (26 chars) |
| Lowercase | a–z (26 chars) |
| Numbers | 0–9 (10 chars) |
| Symbols | !@#$%^&*()-_=+ |
| Alphanumeric | A–Z, a–z, 0–9 |
| Hex | 0–9, a–f |
| Custom | Define your own |

### Length vs Security (Alphanumeric)

| Length | Possible Combinations | Use Case |
|---|---|---|
| 8 chars | 218 trillion | Low-security codes |
| 16 chars | ~47 septillion | API keys, tokens |
| 32 chars | Astronomical | Encryption keys |
| 64 chars | Maximum security | Master secrets |

### Common Use Cases

- **API keys**: 32-char alphanumeric strings
- **Session tokens**: 64-char hex strings  
- **Verification codes**: 6-char numeric strings
- **Unique filenames**: 16-char alphanumeric
- **Database seeds**: Random test data strings
- **One-time passwords (OTP)**: 6-8 digit numeric

### How to Generate a Random String

1. Set your desired string length
2. Select character types (letters, numbers, symbols)
3. Choose quantity (generate 1 or multiple strings)
4. Click **Generate**
5. Copy your string(s) for immediate use`,
  faq:[
    {question:'Is this random string generator secure enough for API keys?',answer:'Yes. It uses the Web Crypto API for cryptographically secure randomness. A 32-character alphanumeric string has over 47 septillion possible values — suitable for API keys and tokens.'},
    {question:'Can I generate multiple strings at once?',answer:'Yes. Set the quantity to generate up to 100 unique random strings in one click — useful for bulk token generation or test data.'},
    {question:'What is the difference between a random string and a UUID?',answer:'UUIDs have a fixed format (8-4-4-4-12 hex characters). Random strings are more flexible — you control the length and character set. Both are unique identifiers for different use cases.'},
    {question:'Can I exclude ambiguous characters like 0, O, l, 1?',answer:'Yes. Enable the "no ambiguous characters" option to exclude visually similar characters — ideal for user-facing codes like vouchers and invite codes.'},
    {question:'Is this tool free?',answer:'Yes. Generate unlimited random strings for free with no signup required.'},
  ]
},
{
  toolSlug:'random-color',locale:'en',
  seoTitle:'Random Color Generator – Get Instant HEX, RGB & HSL Colors Free',
  seoDescription:'Generate beautiful random colors with HEX, RGB, and HSL codes instantly. Find design inspiration, pick palettes, and discover unique color combinations. 100% free.',
  pageH1:'Random Color Generator – Discover Beautiful Colors Instantly',
  seoKeywords:['random color generator','random hex color','random color picker','color generator online','random rgb color','random hsl color','color palette generator','hex color generator','random color code','color inspiration tool','random colour generator','color randomizer','color picker random','generate random color','web color generator','random color for design','css color generator','color scheme generator','pastel color generator','random dark color generator'],
  contentBody:`## Random Color Generator – Instant Color Inspiration for Designers

Stuck in a color rut? Our **Random Color Generator** produces beautiful, truly random colors complete with HEX, RGB, and HSL codes — ready to copy directly into your design tool, CSS, or code.

### Color Formats Provided

Every generated color includes all three standard formats:

- **HEX**: \`#A3C4BC\` — Used in HTML/CSS, design tools
- **RGB**: \`rgb(163, 196, 188)\` — Used in CSS, JavaScript, print
- **HSL**: \`hsl(168, 22%, 70%)\` — Human-readable, great for adjustments

### Generate Colors by Type

| Color Mode | Description |
|---|---|
| Any Color | Fully random from entire spectrum |
| Light Colors | High brightness values only |
| Dark Colors | Low brightness values only |
| Pastel Colors | Soft, desaturated tones |
| Vibrant Colors | High saturation, bold hues |
| Warm Colors | Reds, oranges, yellows |
| Cool Colors | Blues, greens, purples |

### Using Random Colors in Design

Random colors are great for:
- **Breaking creative blocks**: Start with an unexpected color, build a palette around it
- **A/B testing**: Test different color schemes for buttons and CTAs
- **Generative art**: Create color-based algorithmic artwork
- **Placeholder styling**: Color-code test UI components

### Building a Palette from a Random Color

1. Generate a random base color
2. Use HSL to create variations: adjust only the L (lightness) for tints and shades
3. Find complementary colors by rotating the H (hue) by 180°
4. Find analogous colors by rotating H by ±30°`,
  faq:[
    {question:'Can I copy the HEX code directly?',answer:'Yes. Click the copy button next to any color format (HEX, RGB, HSL) to copy it to your clipboard instantly.'},
    {question:'Can I generate multiple random colors at once?',answer:'Yes. Switch to palette mode to generate 5 or more random colors simultaneously — perfect for creating color schemes and palettes.'},
    {question:'Can I filter by warm or cool colors?',answer:'Yes. Use the color type filter to restrict generation to warm (reds/oranges/yellows), cool (blues/greens/purples), pastel, dark, or light colors.'},
    {question:'Are the generated colors suitable for web accessibility?',answer:'Random colors may not always meet WCAG contrast requirements. After picking a color, use a contrast checker to verify it works for text on your background.'},
    {question:'Is this random color generator free?',answer:'Yes, completely free with no login required. Generate unlimited colors instantly.'},
  ]
},
{
  toolSlug:'random-date',locale:'en',
  seoTitle:'Random Date Generator – Pick Random Dates in Any Range Free',
  seoDescription:'Generate random dates within any custom date range. Perfect for testing, research, creative writing, and game development. Free online random date picker tool.',
  pageH1:'Random Date Generator – Generate Random Dates in Any Time Range',
  seoKeywords:['random date generator','random date picker','generate random date','random date online','date randomizer','random birthday generator','random date range','pick random date','random date tool','random date creator','date picker random','random year generator','random month generator','random historical date','random future date','random date for testing','date generator tool','random calendar date','random date selector','date picker free'],
  contentBody:`## Random Date Generator – Random Dates for Any Purpose

Whether you need a random date for software testing, research data, storytelling, or games, our **Random Date Generator** lets you specify any date range and instantly produce random calendar dates.

### Use Cases for Random Date Generation

- **Software testing**: Generate realistic test data with random birthdays, timestamps, or event dates
- **Data science**: Create random date samples for statistical analysis
- **Creative writing**: Generate historical periods or future timelines for fiction
- **Game development**: Randomize in-game dates, event schedules, and historical scenarios
- **Education**: Create test questions with random date problems
- **Giveaways**: Pick a random "mystery date" for time-locked prizes

### Date Range Options

| Option | Example |
|---|---|
| Any date in history | 1 Jan 0001 – Today |
| Last century | 1924–2024 |
| This decade | 2020–2030 |
| Custom range | Your specified start–end |
| Business days only | Excludes weekends |
| Weekdays only | Mon–Fri only |

### Output Formats

Generated dates can be formatted in multiple ways:
- **ISO 8601**: \`2024-03-15\` (for databases and APIs)
- **US format**: \`March 15, 2024\`
- **UK format**: \`15/03/2024\`
- **Unix timestamp**: \`1710460800\` (for programming)

### Generating Multiple Random Dates

Need a dataset of random dates? Enable bulk mode to generate 10, 100, or more random dates at once — ideal for populating test databases or research datasets.`,
  faq:[
    {question:'Can I generate random dates excluding weekends?',answer:'Yes. Enable the "weekdays only" option to generate random dates that fall only on Monday through Friday — useful for business scheduling simulations.'},
    {question:'Can I generate random dates in the future?',answer:'Yes. Set your start date to tomorrow and your end date to any future point to generate random future dates.'},
    {question:'What date formats are supported?',answer:'The tool outputs dates in multiple formats: ISO 8601 (YYYY-MM-DD), US (MM/DD/YYYY), UK (DD/MM/YYYY), and Unix timestamp. Select your preferred format before generating.'},
    {question:'Can I generate multiple random dates at once?',answer:'Yes. Set the quantity to generate up to 1000 random dates in one click — perfect for creating test data or research datasets.'},
    {question:'Is this random date generator free?',answer:'Yes, 100% free with no registration required.'},
  ]
},
{
  toolSlug:'random-ip',locale:'en',
  seoTitle:'Random IP Generator – Generate Random IPv4 Addresses Free',
  seoDescription:'Generate random IPv4 and IPv6 addresses for network testing, development, and simulations. Create valid, realistic IP addresses in bulk instantly. Free online tool.',
  pageH1:'Random IP Address Generator – Valid IPs for Testing & Development',
  seoKeywords:['random ip generator','random ip address','generate random ip','random ipv4 generator','random ip online','fake ip generator','random ip address tool','random ipv6 generator','bulk ip generator','ip address randomizer','random ip for testing','random network address','generate fake ip','random public ip','random private ip','random ip creator','ip generator online','random ip address list','ipv4 generator free','random ip address generator'],
  contentBody:`## Random IP Generator – Create Valid IP Addresses for Testing

Network developers, security researchers, and QA engineers frequently need realistic IP addresses for testing without using real user data. Our **Random IP Generator** creates valid IPv4 and IPv6 addresses in bulk, with options for public, private, or specific subnet ranges.

### IPv4 vs IPv6

| Type | Format | Example |
|---|---|---|
| IPv4 | 4 octets (0–255) | \`192.168.1.105\` |
| IPv6 | 8 hex groups | \`2001:0db8:85a3::8a2e:0370:7334\` |

IPv4 remains the most common format for general testing. IPv6 is used for modern network simulations.

### IP Address Classes

| Class | Range | Typical Use |
|---|---|---|
| Class A | 1.0.0.0 – 126.255.255.255 | Large networks |
| Class B | 128.0.0.0 – 191.255.255.255 | Medium networks |
| Class C | 192.0.0.0 – 223.255.255.255 | Small networks |
| Private | 10.x, 172.16–31.x, 192.168.x | Internal/LAN |

### Common Use Cases

- **Unit testing**: Generate realistic IP data without using real user IPs
- **Database seeding**: Populate test databases with IP address fields
- **Network simulation**: Test firewall rules with varied IP ranges
- **Log analysis testing**: Create realistic access log samples
- **Security research**: Test IP-based rate limiting and geolocation logic
- **Load testing**: Simulate traffic from multiple IP addresses

### How to Generate Random IPs

1. Select IP version (IPv4 or IPv6)
2. Choose range type (public, private, or custom subnet)
3. Set quantity (1 to 1000)
4. Click **Generate**
5. Copy the list for use in your application`,
  faq:[
    {question:'Are the generated IP addresses real or fake?',answer:'They are mathematically valid IP addresses but not assigned to any real device or user. They follow proper IPv4/IPv6 formatting rules and can be used safely for testing.'},
    {question:'Can I generate private IP addresses only?',answer:'Yes. Select "private range" to generate IPs from 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 ranges — suitable for internal network simulations.'},
    {question:'Can I generate IPs from a specific subnet?',answer:'Yes. Enter your subnet (e.g., 192.168.1.0/24) and the generator will produce random IPs within that range only.'},
    {question:'Can I export the generated IP list?',answer:'Yes. Generated IPs can be copied as a plain list, comma-separated, or downloaded as a text file for direct use in your tools.'},
    {question:'Is this IP generator free?',answer:'Yes. Generate unlimited random IP addresses for free with no registration required.'},
  ]
},
{
  toolSlug:'qr-code-generator',locale:'en',
  seoTitle:'QR Code Generator – Create Custom QR Codes for Links & Text Free',
  seoDescription:'Generate professional QR codes for URLs, text, contact info, WiFi, and more. Customize colors, download in PNG/SVG, no watermark. Free online QR code maker.',
  pageH1:'Free QR Code Generator – Create Custom QR Codes in Seconds',
  seoKeywords:['qr code generator','qr code maker','free qr code generator','create qr code','custom qr code','qr code creator','qr code for url','qr code download','qr code online','generate qr code','qr code png','qr code svg','wifi qr code generator','qr code for text','contact qr code','vcard qr code','colored qr code','qr code no watermark','qr code tool','qr code generator free download'],
  contentBody:`## Free QR Code Generator – Connect the Physical and Digital World

QR codes bridge the gap between physical materials and digital content. Our **QR Code Generator** creates professional, scannable QR codes for any content type — with full color customization and multiple download formats, completely free.

### What You Can Encode in a QR Code

| Content Type | Use Case |
|---|---|
| URL / Website | Link print materials to web pages |
| Plain Text | Share information without a link |
| Email Address | Pre-fill recipient in email apps |
| Phone Number | Enable one-tap calling |
| SMS Message | Pre-filled text message |
| WiFi Credentials | Share network access without typing |
| vCard / Contact | Share contact details |
| Location | Link to Google Maps coordinates |

### QR Code Customization Options

- **Foreground color**: Match your brand colors
- **Background color**: Transparent or custom
- **Error correction level**: L (7%), M (15%), Q (25%), H (30%)
- **Size**: 200px – 2000px
- **Format**: PNG (web), SVG (scalable), PDF (print)
- **Logo embed**: Add your logo to the center

### Error Correction Levels Explained

Higher error correction means the QR code can still be scanned even if part of it is damaged or obscured (e.g., when adding a logo):

- **Level L**: Best for clean environments, smallest file size
- **Level H**: Use when adding logos or expecting physical wear

### Best Practices for QR Code Usage

- Always test your QR code before printing
- Maintain at least 3mm of white space (quiet zone) around the code
- Minimum print size: 2.5cm × 2.5cm for reliable scanning
- Use high-contrast colors — dark pattern on light background
- Include a call-to-action near the code: "Scan to visit..."`,
  faq:[
    {question:'Do QR codes expire?',answer:'QR codes themselves never expire — they are just encoded data. However, if the URL they point to goes offline or changes, the QR code will no longer work. Dynamic QR codes with redirect URLs can be updated without reprinting.'},
    {question:'Can I add my logo to the QR code?',answer:'Yes. Use error correction level H (30%) when adding a logo — this ensures the code remains scannable even with part of the data obscured by the logo.'},
    {question:'What is the best QR code format — PNG or SVG?',answer:'Use SVG for print materials (it scales without quality loss). Use PNG for digital use (websites, emails, presentations). Always generate at the highest needed size.'},
    {question:'How small can a QR code be and still scan reliably?',answer:'The minimum reliable size for print is 2.5cm × 2.5cm (about 1 inch square). For digital displays, at least 150×150 pixels. Always test scanning before finalizing.'},
    {question:'Is this QR code generator free with no watermark?',answer:'Yes. All QR codes are generated completely free with no watermarks, no account required, and no usage limits.'},
  ]
},
{
  toolSlug:'lorem-ipsum',locale:'en',
  seoTitle:'Lorem Ipsum Generator – Professional Placeholder Text for Design',
  seoDescription:'Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Get standard or custom dummy text for design mockups and web development. Free instant tool.',
  pageH1:'Lorem Ipsum Generator – Instant Placeholder Text for Any Project',
  seoKeywords:['lorem ipsum generator','placeholder text generator','dummy text generator','lorem ipsum text','generate lorem ipsum','lorem ipsum online','fake text generator','filler text generator','lorem ipsum paragraphs','lorem ipsum words','lorem ipsum sentences','design placeholder text','web mockup text','lorem ipsum free','lorem ipsum tool','dummy content generator','greeking text generator','placeholder content','lorem ipsum maker','lorem ipsum creator'],
  contentBody:`## Lorem Ipsum Generator – The Designer's Essential Placeholder Tool

**Lorem Ipsum** is the standard placeholder text used by designers, developers, and publishers when the final content isn't ready yet. It lets you visualize layouts, typography, and spacing without being distracted by actual readable content.

### The Origin of Lorem Ipsum

Lorem Ipsum text is derived from a work by Cicero (45 BC) — "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil). The scrambled version has been used as placeholder text since the 1500s and became the digital standard with desktop publishing in the 1980s.

### Standard Lorem Ipsum

The classic Lorem Ipsum opening:
\`\`\`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua...
\`\`\`

### Generation Options

| Option | Description |
|---|---|
| Paragraphs | Full paragraphs of varying length |
| Sentences | Individual sentences |
| Words | Specific word count |
| Characters | Exact character count |
| HTML format | Wrapped in \`<p>\` tags |
| Start with "Lorem ipsum" | Classical opening |

### When to Use Lorem Ipsum

- **UI/UX design mockups**: Fill in text areas to test layout proportions
- **Typography testing**: See how fonts render with realistic text density
- **Print design**: Check column widths and line lengths
- **Email templates**: Test how text flows in various email clients
- **CMS development**: Populate test articles before real content exists

### Alternatives to Lorem Ipsum

Some prefer more contextually relevant placeholder text:
- **Language-specific filler**: For testing non-Latin character rendering
- **Industry-specific text**: Realistic dummy content for demos
- **Lipsum variations**: Bacon ipsum, Cupcake ipsum (fun alternatives)`,
  faq:[
    {question:'Why is Lorem Ipsum used instead of regular English text?',answer:'Lorem Ipsum prevents readers from being distracted by readable content. The goal is to evaluate design and layout, not the text itself. The meaningless Latin text achieves this perfectly.'},
    {question:'Can I generate Lorem Ipsum in HTML format?',answer:'Yes. Enable the HTML option to get text wrapped in <p> tags, ready to paste directly into HTML files or CMS editors.'},
    {question:'Can I specify an exact word or character count?',answer:'Yes. Switch between paragraphs, sentences, words, or character count modes. Perfect when you need text to fit a specific design constraint.'},
    {question:'Is standard Lorem Ipsum always the same text?',answer:'The first few words are always "Lorem ipsum dolor sit amet..." but the remaining text is randomly varied each generation to simulate natural text variation.'},
    {question:'Is this Lorem Ipsum generator free?',answer:'Yes, completely free. Generate unlimited placeholder text with no account required.'},
  ]
},
];

const data2 = [
{
  toolSlug:'my-ip-address',locale:'en',
  seoTitle:'What Is My IP Address – Check Your Public IP & Location Free',
  seoDescription:'Instantly find your public IPv4 and IPv6 address, ISP, city, country, and connection details. Free, private IP address lookup tool — no app required.',
  pageH1:'What Is My IP Address – Find Your Public IP Location Instantly',
  seoKeywords:['what is my ip','my ip address','check my ip','find my ip address','public ip address','my ip location','ip address checker','ip lookup tool','my ip address online','find ip address','ip address finder','what is my ip address','my public ip','ip address locator','ip geolocation','my ipv4 address','my ipv6 address','ip address tool','internet ip address','my isp ip address'],
  contentBody:`## What Is My IP Address – Everything About Your Internet Connection

Every device connected to the internet is assigned an **IP (Internet Protocol) address** — a unique number that identifies your device on the network. Our tool reveals your current public IP address along with location and connection details instantly.

### Public IP vs Private IP

| Type | Range | Who Assigns It | Visible To |
|---|---|---|---|
| Public IP | Globally unique | Your ISP | Everyone on the internet |
| Private IP | 192.168.x.x / 10.x.x.x | Your router | Only your local network |

Your **public IP** is what websites and services see when you connect. Your **private IP** is your address within your home or office network.

### What Information Is Revealed by Your IP

- **IPv4 Address**: Your primary public IP (e.g., 203.0.113.45)
- **IPv6 Address**: Next-generation IP format (if supported)
- **ISP**: Your internet service provider (e.g., Jio, Airtel, Comcast)
- **City & Country**: Approximate geographic location
- **ASN**: Autonomous System Number (network identifier)
- **Connection type**: Broadband, mobile, VPN, proxy

### Why Your IP Address Matters

- **Websites use your IP** to determine your country and serve localized content
- **Streaming services** use IP geolocation for regional content restrictions
- **Online gaming** servers may block IPs from certain regions
- **Security systems** use IP reputation to detect fraud and bots

### Can Your IP Address Reveal Your Exact Location?

Your IP provides an **approximate** location — typically city-level accuracy. It does NOT reveal your exact street address. ISPs maintain IP-to-location databases, but these are often inaccurate by several kilometers.

### Hiding Your IP Address

Use a **VPN (Virtual Private Network)** to mask your real IP. Your traffic appears to originate from the VPN server's IP — used for privacy, bypassing geo-restrictions, and public Wi-Fi security.`,
  faq:[
    {question:'Can someone find my home address from my IP address?',answer:'No. IP geolocation typically shows city-level accuracy and is often off by many miles. Your exact home address requires a court order to obtain from your ISP.'},
    {question:'Why does my IP address show a different city?',answer:'ISPs assign IP blocks to regions, which may not match your exact location. VPNs, proxies, and mobile data can show IPs from different cities or countries entirely.'},
    {question:'Does my IP address change?',answer:'Most home connections have dynamic IPs that change periodically (when you restart your router or modem). Businesses often pay for static (permanent) IP addresses.'},
    {question:'What is the difference between IPv4 and IPv6?',answer:'IPv4 uses 32-bit addresses (e.g., 192.168.1.1) — limited to ~4.3 billion addresses. IPv6 uses 128-bit addresses, providing virtually unlimited unique IPs for the growing internet.'},
    {question:'Is this IP checker free and private?',answer:'Yes. We display your IP information but do not log, store, or track it. The tool is completely free with no registration required.'},
  ]
},
{
  toolSlug:'browser-info',locale:'en',
  seoTitle:'Browser Information Tool – Check Your Browser Version & System Details',
  seoDescription:'Get complete details about your browser, operating system, screen resolution, installed plugins, and User-Agent string. Free browser detection tool for developers.',
  pageH1:'Browser Information Tool – Full Browser & System Details Instantly',
  seoKeywords:['browser info tool','what browser am i using','my browser version','browser information','browser detector','user agent checker','browser details online','check browser version','browser system info','browser detection tool','what is my browser','browser info checker','browser compatibility tool','my os version','screen resolution checker','browser user agent','check browser settings','browser fingerprint','browser diagnostics','web browser info'],
  contentBody:`## Browser Information Tool – Know Exactly What Browser You're Using

Whether you're debugging a website, helping someone with tech support, or checking browser compatibility, our **Browser Information Tool** gives you a complete snapshot of your browser environment in one click.

### Information Displayed

| Detail | Example |
|---|---|
| Browser name & version | Chrome 120.0.6099.130 |
| Rendering engine | Blink (Chrome/Edge), Gecko (Firefox) |
| Operating system | Windows 11, macOS 14.2, Android 14 |
| User-Agent string | Full UA string for debugging |
| Screen resolution | 1920×1080, 2560×1440 |
| Color depth | 24-bit, 30-bit |
| Cookies enabled | Yes / No |
| JavaScript enabled | Yes (you're viewing this page) |
| Language settings | en-US, en-GB, hi-IN |
| Platform | Win32, MacIntel, Linux x86_64 |

### What Is a User-Agent String?

The **User-Agent** is a text string your browser sends to every website, identifying:
- Browser name and version
- Rendering engine
- Operating system and version
- Device type (mobile vs desktop)

Example:
\`\`\`
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 
(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
\`\`\`

### Common Use Cases

- **Web developers**: Verify browser compatibility during development and testing
- **Tech support**: Identify a user's exact browser version when troubleshooting
- **QA testing**: Document the browser environment when filing bug reports
- **Security audits**: Check if a browser is outdated and vulnerable`,
  faq:[
    {question:'Why do I need to know my browser information?',answer:'Browser information is essential for troubleshooting website issues, filing bug reports, checking if your browser needs updating, and verifying compatibility with web applications.'},
    {question:'What is a browser User-Agent?',answer:'A User-Agent is a string your browser sends to every website, identifying your browser, version, and operating system. Developers use it for browser detection and compatibility handling.'},
    {question:'Can websites see my browser information without me sharing it?',answer:'Yes. Every time you visit a website, your browser automatically sends your User-Agent string, screen resolution, language settings, and other details as part of the HTTP request.'},
    {question:'Is this browser info tool free?',answer:'Yes. Completely free with no account required. Your browser information is displayed only to you and is not stored.'},
    {question:'Can I use this to check if my browser needs updating?',answer:'Yes. The tool shows your exact browser version. Compare it to the latest version on your browser\'s official download page to see if an update is available.'},
  ]
},
{
  toolSlug:'screen-resolution-simulator',locale:'en',
  seoTitle:'Screen Resolution Simulator – Test Website Views at Any Resolution',
  seoDescription:'Simulate how your website appears on different screen resolutions and device sizes. Test layouts for HD, 4K, and custom resolutions. Free online responsive testing tool.',
  pageH1:'Screen Resolution Simulator – Preview Websites at Any Screen Size',
  seoKeywords:['screen resolution simulator','website resolution tester','screen size simulator','resolution checker','website at different resolutions','responsive design tester','screen resolution tool','test website resolution','mobile resolution simulator','desktop resolution test','screen viewport simulator','website preview tool','resolution testing online','device resolution checker','4k resolution simulator','720p resolution test','1080p website preview','custom resolution tester','browser viewport tool','responsive screen test'],
  contentBody:`## Screen Resolution Simulator – Test Your Website on Any Screen

Different users visit your website on wildly different screen sizes — from 360px mobile screens to 5120×2880 iMac Pro displays. Our **Screen Resolution Simulator** lets you preview any URL at any resolution without needing physical devices.

### Common Screen Resolutions to Test

| Device | Resolution | Viewport |
|---|---|---|
| iPhone SE | 375×667 | 375×667 |
| iPhone 14 Pro | 393×852 | 393×852 |
| iPad Pro | 1024×1366 | 1024×1366 |
| Laptop HD | 1366×768 | 1366×768 |
| Desktop FHD | 1920×1080 | 1920×1080 |
| 4K Monitor | 3840×2160 | varies |

### Why Screen Resolution Testing Matters

- **Global users** have vastly different devices. 40%+ of web traffic is mobile
- **Breakpoints** in your CSS may fail at unexpected resolutions
- **Images** may overflow or distort at certain viewport widths
- **Navigation menus** may collapse or overlap at edge-case widths
- **Forms and CTAs** may be cut off on small screens

### How to Test Your Website

1. Enter your website URL
2. Select a preset resolution (mobile, tablet, desktop, 4K)
3. Or enter a custom width × height
4. The simulator loads your site in an iframe at that resolution
5. Scroll, click, and interact to test actual behavior

### Resolution vs Viewport Size

Note: **CSS viewport ≠ physical screen resolution** on high-DPI (Retina) displays. A MacBook Pro has 2560×1600 physical pixels but a 1280×800 CSS viewport. Always test the CSS viewport size, not the physical resolution.`,
  faq:[
    {question:'Is this the same as actual device testing?',answer:'Not exactly. The simulator uses an iframe at specified dimensions. Real device testing also considers touch events, device pixel ratio, and hardware-level rendering differences. Use this for quick checks, and test on real devices for critical issues.'},
    {question:'Can I test any website URL?',answer:'You can test most public websites. Some sites block iframe embedding using X-Frame-Options or Content-Security-Policy headers — in that case, use browser DevTools instead.'},
    {question:'What is the most important resolution to test?',answer:'Test 375px (iPhone standard), 768px (tablet), 1024px, 1280px, and 1920px. These cover the most common real-world viewport widths for your visitors.'},
    {question:'How is this different from Chrome DevTools device mode?',answer:'Both serve similar purposes. This tool offers a standalone simulator without opening browser developer tools — useful for quick checks and sharing resolution previews.'},
    {question:'Is this screen resolution simulator free?',answer:'Yes, completely free with no account or installation required.'},
  ]
},
{
  toolSlug:'responsive-checker',locale:'en',
  seoTitle:'Responsive Website Checker – Test Mobile & Tablet View Free',
  seoDescription:'Check if your website is fully responsive across mobile, tablet, and desktop devices simultaneously. See how your site looks on all screens at once. Free online tool.',
  pageH1:'Responsive Website Checker – See Your Site on All Devices at Once',
  seoKeywords:['responsive checker','responsive website tester','mobile responsive test','website responsive check','responsive design checker','mobile friendly test','tablet view checker','responsive test online','website mobile view','responsive website tool','mobile responsiveness checker','test responsive website','responsive layout tester','website on all devices','mobile site checker','responsive preview tool','cross device checker','multi device preview','responsive web design test','mobile website checker free'],
  contentBody:`## Responsive Website Checker – Instant Multi-Device Preview

With over 50% of web traffic coming from mobile devices, responsive design is not optional — it's essential. Our **Responsive Website Checker** shows your website simultaneously across mobile, tablet, and desktop viewports so you can spot layout issues at a glance.

### Viewports Tested Simultaneously

| Device | Width | Represents |
|---|---|---|
| Mobile Portrait | 375px | iPhone, Android phones |
| Mobile Landscape | 667px | Phones in landscape |
| Tablet Portrait | 768px | iPad, Android tablets |
| Tablet Landscape | 1024px | Tablets in landscape |
| Desktop | 1280px | Laptops |
| Wide Desktop | 1920px | Full HD monitors |

### Common Responsive Design Issues Detected

- **Text overflow**: Text spilling outside containers on small screens
- **Image overflow**: Images wider than the viewport
- **Navigation collapse**: Hamburger menu not working correctly
- **Button overlap**: Buttons too close together on mobile
- **Font too small**: Text under 16px on mobile (causes browser zoom)
- **Horizontal scroll**: Page wider than viewport
- **Fixed-width elements**: Elements not scaling with screen width

### Google's Mobile-First Indexing

Since 2019, Google uses **mobile-first indexing** — meaning Google primarily crawls and ranks the mobile version of your website. A website that isn't responsive will:
- Rank lower in Google mobile search results
- Have higher mobile bounce rates
- Lose potential customers on mobile

### How to Check Your Website's Responsiveness

1. Enter your website URL
2. Click **Check Responsiveness**
3. View your site in all device sizes simultaneously
4. Identify and fix any layout issues`,
  faq:[
    {question:'What does "mobile responsive" mean?',answer:'A responsive website automatically adjusts its layout, images, and text to fit any screen size. It uses fluid grids, flexible images, and CSS media queries to work on all devices.'},
    {question:'Does Google penalize non-responsive websites?',answer:'Yes. Google uses mobile-first indexing since 2019. Non-responsive websites rank lower in mobile search results, which significantly reduces organic traffic since most searches are on mobile.'},
    {question:'Is this different from Google\'s Mobile-Friendly Test?',answer:'Google\'s Mobile-Friendly Test checks a single mobile view and reports technical issues. This tool shows a visual multi-device preview simultaneously, helping you spot design issues quickly.'},
    {question:'Can I check any website, not just mine?',answer:'Yes. Enter any public website URL to check its responsiveness. Useful for competitor analysis and design research.'},
    {question:'Is this responsive checker free?',answer:'Yes. Check unlimited websites for responsiveness completely free with no registration required.'},
  ]
},
{
  toolSlug:'email-validator',locale:'en',
  seoTitle:'Email Address Validator – Verify Email Format & Syntax Free',
  seoDescription:'Validate any email address format and syntax instantly. Check if an email is properly formatted before sending or storing. Free, fast, regex-based email checker.',
  pageH1:'Email Address Validator – Check Email Format & Syntax Instantly',
  seoKeywords:['email validator','email address validator','validate email address','email format checker','email syntax checker','check email validity','email verification tool','email format validator','valid email checker','email address checker','email validation online','free email validator','bulk email validator','email regex checker','verify email address','email address format','email validation tool','check email format','email checker free','email address valid'],
  contentBody:`## Email Address Validator – Catch Invalid Emails Before They Cause Problems

An invalid email address in your database costs you money — bounced emails, undeliverable notifications, and polluted analytics. Our **Email Address Validator** checks email syntax and format using RFC 5322 standards before you accept or send anything.

### What Does Email Validation Check?

| Check | Valid Example | Invalid Example |
|---|---|---|
| @ symbol present | user@domain.com | userdomain.com |
| Domain part exists | user@gmail.com | user@ |
| TLD present | user@domain.com | user@domain |
| No spaces | user@domain.com | user @domain.com |
| No double dots | user@domain.com | user..name@domain.com |
| Valid characters | user.name+tag@domain.co | user#name@domain |

### Types of Email Validation

**1. Syntax/Format Validation (This Tool)**
- Checks if the email follows proper email formatting rules
- Instant, no network requests required
- Catches obvious typos and format errors

**2. DNS/MX Record Validation**
- Checks if the email domain has valid mail server records
- Requires network lookup

**3. SMTP Validation**
- Actually connects to the mail server to verify the mailbox exists
- Most accurate but slowest method

### Why Validate Emails?

- **Forms & registrations**: Prevent users from accidentally mistyping
- **Email marketing lists**: Remove invalid addresses before campaigns
- **Database cleanup**: Audit and clean existing contact databases
- **API integrations**: Validate emails before passing to third-party services

### Common Invalid Email Patterns to Catch

\`\`\`
test @domain.com     ← Space before @
test@domain          ← Missing TLD
test@@domain.com     ← Double @
@domain.com          ← Missing local part
test@.com            ← Missing domain name
\`\`\``,
  faq:[
    {question:'Does email validation confirm if an email address actually exists?',answer:'Format validation only confirms the email is correctly structured. To confirm if a mailbox actually exists, SMTP validation is needed — which involves connecting to the recipient\'s mail server.'},
    {question:'Can this validator check bulk email lists?',answer:'Yes. Switch to bulk mode and paste a list of email addresses (one per line) to validate multiple emails at once — ideal for cleaning mailing lists.'},
    {question:'Why is email validation important for forms?',answer:'Without validation, users submit typos like "gmial.com" instead of "gmail.com". This results in undeliverable account emails, lost users, and inflated subscriber numbers with bad data.'},
    {question:'Is format validation enough for my use case?',answer:'For form validation to catch typos, yes. For email marketing list hygiene, use additional DNS/MX validation. For mission-critical systems, use SMTP verification.'},
    {question:'Is this email validator free?',answer:'Yes. Validate unlimited email addresses for free with no account required.'},
  ]
},
{
  toolSlug:'url-opener',locale:'en',
  seoTitle:'Bulk URL Opener – Open Multiple Links Simultaneously in New Tabs',
  seoDescription:'Open multiple URLs at once in separate browser tabs with one click. Save time during research, content audits, and link building. Free bulk link opener tool.',
  pageH1:'Bulk URL Opener – Open Multiple Links in One Click',
  seoKeywords:['url opener','bulk url opener','open multiple urls','open multiple links','bulk link opener','open links in tabs','multiple url opener','url batch opener','open many links','open links simultaneously','bulk open urls','tab opener tool','multiple links opener','open urls at once','link batch opener','url list opener','open multiple websites','bulk website opener','open all links','url opener tool free'],
  contentBody:`## Bulk URL Opener – Open Dozens of Links Instantly

Manually opening 20 links one by one wastes valuable time. Our **Bulk URL Opener** lets you paste a list of URLs and open them all in separate browser tabs simultaneously — transforming a tedious task into a single click.

### Who Uses the Bulk URL Opener?

- **SEO professionals**: Check multiple pages for on-page issues quickly
- **Content auditors**: Review many pages during site audits
- **Researchers**: Open a prepared reading list in one go
- **Link builders**: Verify prospect websites in batch
- **Social media managers**: Review multiple profiles at once
- **Developers**: Open all staging URLs during deployment checks

### How to Use the Bulk URL Opener

1. Paste your list of URLs — one URL per line
2. Set your delay (0–5 seconds between tabs, to avoid browser blocking)
3. Click **Open All URLs**
4. All tabs open simultaneously in your browser

**Example Input:**
\`\`\`
https://example1.com
https://example2.com
https://example3.com
\`\`\`

### Browser Tab Limits

Most browsers allow up to **50–100 tabs** open simultaneously. If you need to open more URLs, use the delay option or split your list into batches.

### Tips for Bulk URL Opening

- **Enable pop-up permissions**: Browsers block multiple tabs by default — allow pop-ups for this site when prompted
- **Use delay for large lists**: A 0.5-second delay prevents browser freezing for 20+ URLs
- **Prepare your list**: Clean your URL list with our URL cleaner first
- **Check system RAM**: Each tab consumes memory — 50 tabs can use 2–4GB RAM`,
  faq:[
    {question:'Why does my browser block the tabs from opening?',answer:'Browsers block pop-ups by default. When you click Open All URLs, allow pop-ups in the browser prompt that appears. You may need to do this once per browser session.'},
    {question:'How many URLs can I open at once?',answer:'You can paste unlimited URLs, but opening 50+ tabs simultaneously may freeze your browser. Use the delay option or process URLs in batches of 20-30 for best performance.'},
    {question:'Does this work on all browsers?',answer:'Yes — Chrome, Firefox, Edge, Safari, and Opera all support this tool. Chrome and Edge handle multiple tabs most efficiently.'},
    {question:'Can I open URLs in the same tab instead of new tabs?',answer:'The tool opens each URL in a separate new tab to allow simultaneous viewing. Opening in the same tab would simply navigate away from the tool.'},
    {question:'Is the Bulk URL Opener free?',answer:'Yes. Open unlimited URLs for free with no account or registration required.'},
  ]
},
{
  toolSlug:'chatgpt-prompt-generator',locale:'en',
  seoTitle:'ChatGPT Prompt Generator – Build Powerful AI Prompts Free',
  seoDescription:'Generate detailed, structured ChatGPT and AI prompts for writing, coding, marketing, and more. Get better AI results with professionally crafted prompts. Free tool.',
  pageH1:'ChatGPT Prompt Generator – Get Better Results From Any AI Model',
  seoKeywords:['chatgpt prompt generator','ai prompt generator','chatgpt prompts','prompt engineering tool','gpt prompt maker','ai writing prompts','chatgpt prompt builder','prompt generator free','best chatgpt prompts','ai prompt creator','chatgpt prompt ideas','gpt-4 prompts','prompt engineering free','custom ai prompts','chatgpt prompt template','ai prompt tool','effective chatgpt prompts','writing prompts ai','marketing prompts ai','coding prompts chatgpt'],
  contentBody:`## ChatGPT Prompt Generator – Craft Prompts That Get Results

The quality of your **AI output is directly proportional to the quality of your prompt**. Vague prompts get generic results; structured, detailed prompts unlock the full potential of ChatGPT, Claude, Gemini, and other AI models.

### The Anatomy of an Effective AI Prompt

A powerful prompt has these elements:

1. **Role**: Assign an expert persona ("Act as a senior marketing strategist...")
2. **Task**: Clearly state what you want ("Write a detailed analysis of...")
3. **Context**: Provide relevant background information
4. **Format**: Specify output format (bullet points, table, code block, essay)
5. **Constraints**: Word count, tone, audience, what to avoid
6. **Examples**: Show what you want (few-shot prompting)

### Prompt Templates by Use Case

**Content Writing:**
\`\`\`
Act as a professional copywriter. Write a [length] [content type] 
about [topic] for [target audience]. Use a [tone] tone. 
Include [specific elements]. Avoid [what to exclude].
\`\`\`

**Code Generation:**
\`\`\`
You are a senior [language] developer. Write a [function/class/script] 
that [does what]. Requirements: [list]. Include error handling and comments.
\`\`\`

**Business Analysis:**
\`\`\`
Act as a business analyst. Analyze [topic] and provide [output type]. 
Consider [specific factors]. Format as [table/bullets/report].
\`\`\`

### Common Prompt Engineering Techniques

- **Chain-of-thought**: Ask the AI to "think step by step"
- **Few-shot**: Provide 2-3 examples of desired output before your request
- **Role assignment**: "Act as..." dramatically improves specialized responses
- **Negative constraints**: "Do not include..." reduces unwanted content`,
  faq:[
    {question:'What makes a good ChatGPT prompt?',answer:'A good prompt is specific, provides context, assigns a role, specifies the output format, and includes any constraints. The more detail you provide, the more targeted and useful the AI response.'},
    {question:'Can I use these prompts with other AI models?',answer:'Yes. The prompts work with ChatGPT (GPT-3.5/4), Claude, Gemini, Llama, Mistral, and any other language model. Prompt engineering principles are universal.'},
    {question:'What is prompt engineering?',answer:'Prompt engineering is the practice of designing inputs (prompts) to get optimal outputs from AI language models. It\'s a growing field with significant impact on AI productivity.'},
    {question:'How do I make ChatGPT write in my style?',answer:'Provide examples of your existing writing in the prompt: "Here are three examples of my writing style: [examples]. Now write [content] in this same style."'},
    {question:'Is this prompt generator free?',answer:'Yes. Generate unlimited AI prompts completely free with no account required.'},
  ]
},
{
  toolSlug:'ai-content-detector',locale:'en',
  seoTitle:'AI Content Detector – Check If Text Was Written by AI or Human',
  seoDescription:'Detect if content was generated by ChatGPT, Gemini, or other AI tools. Free AI vs human text analysis for students, educators, and content creators.',
  pageH1:'AI Content Detector – Identify AI-Generated Text Instantly',
  seoKeywords:['ai content detector','ai text detector','chatgpt detector','ai writing detector','detect ai content','ai generated text checker','chatgpt content checker','ai vs human text','ai plagiarism checker','gpt detector','ai text checker','human vs ai content','ai detection tool','check if ai wrote this','ai generated content detector','detect chatgpt text','ai content checker free','ai detector online','ai written content','ai content analysis'],
  contentBody:`## AI Content Detector – Spot AI-Generated Text in Seconds

As AI writing tools like ChatGPT, Gemini, and Claude become mainstream, the ability to distinguish AI-generated from human-written content has become critical for educators, publishers, and content teams. Our **AI Content Detector** analyzes text patterns to estimate the probability of AI authorship.

### How AI Content Detection Works

AI language models generate text with statistically predictable patterns:

- **High perplexity**: AI tends to choose "safe," common word sequences
- **Low burstiness**: AI text has consistent sentence length and complexity
- **Repetitive structures**: AI overuses certain sentence constructions
- **Confident hedging**: Characteristic phrases like "It is worth noting that..."

Human writing shows more variation, unexpected word choices, and stylistic inconsistency — which is how detectors differentiate them.

### What the Detector Analyzes

| Signal | AI Pattern | Human Pattern |
|---|---|---|
| Sentence length | Consistent | Variable |
| Vocabulary | Predictable | Surprising choices |
| Phrasing | Formal templates | Colloquial/personal |
| Structure | Perfectly organized | Naturally flowing |
| Perplexity score | Low (predictable) | High (varied) |

### Use Cases

- **Educators**: Check student submissions for AI-generated content
- **Publishers**: Verify content authenticity before publication
- **HR departments**: Screen job application materials
- **SEO teams**: Ensure content meets Google's helpful content standards
- **Clients**: Verify freelancer work is original and human-written

### Important Limitations

No AI detector is 100% accurate. False positives (flagging human text as AI) and false negatives (missing AI text) occur. Use results as an indicator, not a definitive proof. Heavy editing of AI text can reduce detection accuracy.`,
  faq:[
    {question:'Is AI content detection 100% accurate?',answer:'No detector is 100% accurate. Current tools have false positive rates of 5-20%. Use detection scores as a signal to investigate further, not as definitive proof of AI authorship.'},
    {question:'Can edited AI content be detected?',answer:'Heavily edited AI content is harder to detect. Minor edits (a few words changed) are usually still detectable. Major rewrites may fall below the detection threshold.'},
    {question:'Does Google penalize AI-generated content?',answer:'Google penalizes low-quality, unoriginal content regardless of how it was created. High-quality, helpful AI-assisted content is acceptable. The focus is on content quality, not AI involvement per se.'},
    {question:'What is a safe AI probability score?',answer:'Under 20% AI probability is generally considered human-written. 20-50% is ambiguous. Over 50% is likely AI-generated. Context matters — technical/formal human writing can score higher.'},
    {question:'Is this AI content detector free?',answer:'Yes. Check unlimited text samples for AI content completely free with no account required.'},
  ]
},
];

const allData = [...data, ...data2];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    let ok=0,fail=0;
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
