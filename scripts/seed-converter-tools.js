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
  toolSlug:'unit-converter',locale:'en',
  seoTitle:'Unit Converter – Convert Length, Weight, Temperature & More Free',
  seoDescription:'Convert any unit of measurement instantly — length, weight, volume, area, temperature, speed, and more. Professional unit converter supporting metric and imperial systems. Free.',
  pageH1:'All-in-One Unit Converter – Convert Any Measurement Instantly',
  seoKeywords:['unit converter','measurement converter','length converter','weight converter','temperature converter','volume converter','metric converter','imperial converter','area converter','speed converter','unit conversion online','free unit converter','convert units online','metric to imperial','cm to inches','kg to pounds','celsius to fahrenheit','liters to gallons','unit conversion tool','measurement unit calculator'],
  contentBody:`## Unit Converter – Every Measurement at Your Fingertips

Converting between measurement units is a daily need for students, engineers, cooks, scientists, and travelers. Our **Unit Converter** handles every common unit category instantly — no formulas to memorize, no errors.

### Supported Unit Categories

| Category | Common Conversions |
|---|---|
| **Length** | mm, cm, m, km, inch, foot, yard, mile |
| **Weight/Mass** | mg, g, kg, ton, ounce, pound, stone |
| **Temperature** | Celsius, Fahrenheit, Kelvin, Rankine |
| **Volume** | ml, L, gallon, quart, pint, cup, fl oz |
| **Area** | mm², cm², m², km², acre, hectare, sq ft |
| **Speed** | km/h, mph, m/s, knot, Mach |
| **Data** | bytes, KB, MB, GB, TB, PB |
| **Pressure** | Pa, kPa, bar, psi, atm |
| **Energy** | J, kJ, cal, kcal, kWh, BTU |

### Quick Reference: Most Common Conversions

**Length:**
- 1 inch = 2.54 cm
- 1 foot = 30.48 cm
- 1 mile = 1.609 km

**Weight:**
- 1 pound = 0.453 kg
- 1 ounce = 28.35 g
- 1 stone = 6.35 kg

**Temperature:**
- °F = (°C × 9/5) + 32
- °C = (°F − 32) × 5/9

### How to Use the Unit Converter

1. Select the unit category (length, weight, temperature, etc.)
2. Enter the value you want to convert
3. Select the source unit
4. Select the target unit
5. Get instant conversion result with formula shown`,
  faq:[
    {question:'Can I convert between metric and imperial units?',answer:'Yes. The converter fully supports conversions between metric (SI) and imperial/US customary units across all categories — length, weight, volume, temperature, and more.'},
    {question:'How accurate are the conversions?',answer:'Conversions use precise international standard conversion factors (NIST standards). Results are shown to 6 significant figures for maximum precision.'},
    {question:'Can I convert temperature between Celsius, Fahrenheit, and Kelvin?',answer:'Yes. The temperature converter handles Celsius, Fahrenheit, Kelvin, and Rankine. Note that temperature conversion uses formulas, not simple multiplication.'},
    {question:'Does this support data unit conversions (KB, MB, GB)?',answer:'Yes. Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes using both decimal (1 KB = 1000 bytes) and binary (1 KiB = 1024 bytes) standards.'},
    {question:'Is this unit converter free?',answer:'Yes. Convert unlimited measurements for free with no account required.'},
  ]
},
{
  toolSlug:'currency-converter',locale:'en',
  seoTitle:'Currency Converter – Live Exchange Rates for 150+ Currencies Free',
  seoDescription:'Convert between 150+ world currencies with live exchange rates. USD, EUR, GBP, INR, JPY, and more. Free real-time currency converter for travel, business, and finance.',
  pageH1:'Currency Converter – Real-Time Exchange Rates for All Currencies',
  seoKeywords:['currency converter','exchange rate converter','live currency converter','usd to inr','eur to usd','currency exchange calculator','real time currency converter','forex converter','money converter online','currency conversion tool','free currency converter','dollar to rupee','euro to dollar','pound to dollar','currency rate checker','international currency converter','travel currency converter','forex rate calculator','currency exchange online','best currency converter'],
  contentBody:`## Currency Converter – Live Rates for Every World Currency

Whether you're traveling, shopping internationally, sending money abroad, or analyzing foreign markets, our **Currency Converter** provides real-time exchange rates for 150+ currencies — always up to date.

### Supported Major Currencies

| Currency | Code | Region |
|---|---|---|
| US Dollar | USD | United States |
| Euro | EUR | European Union |
| British Pound | GBP | United Kingdom |
| Indian Rupee | INR | India |
| Japanese Yen | JPY | Japan |
| Chinese Yuan | CNY | China |
| Canadian Dollar | CAD | Canada |
| Australian Dollar | AUD | Australia |
| Swiss Franc | CHF | Switzerland |
| UAE Dirham | AED | UAE |

### Understanding Exchange Rates

**Mid-market rate**: The midpoint between buy and sell prices — used as the fair rate benchmark. Banks and money transfer services add a **margin** (0.5%–3%) on top of this rate.

**Live vs Interbank rates**: Our tool shows mid-market rates updated regularly. Banks may offer different rates — always compare before transferring large amounts.

### Best Practices for Currency Exchange

- **Compare providers**: Wise, Revolut, and online banks typically offer rates closest to mid-market
- **Avoid airport kiosks**: They charge 5–15% above market rate
- **Use credit cards with no FX fee**: Best rate for travel spending
- **Watch timing**: Currency rates fluctuate continuously — large transfers may benefit from timing

### How to Convert Currency

1. Enter the amount to convert
2. Select the source currency (e.g., USD)
3. Select the target currency (e.g., INR)
4. View the converted amount with current exchange rate`,
  faq:[
    {question:'How often are exchange rates updated?',answer:'Exchange rates are updated regularly from live market data. For the most critical financial decisions, verify with your bank or financial institution for the exact rate at time of transaction.'},
    {question:'What is the difference between the converter rate and my bank rate?',answer:'This tool shows the mid-market (interbank) rate — the fairest benchmark. Banks and exchange services add their margin (profit) on top, so you\'ll receive less than the mid-market rate.'},
    {question:'Can I convert cryptocurrency to fiat currency?',answer:'This converter focuses on traditional (fiat) currencies. For crypto conversions, use a dedicated crypto converter that tracks live crypto market prices.'},
    {question:'Is this currency converter suitable for business use?',answer:'Yes, for reference and estimates. For actual business transactions, always use confirmed rates from your bank or payment processor at the time of the transaction.'},
    {question:'Is this currency converter free?',answer:'Yes. Convert between any currencies for free with no account required.'},
  ]
},
{
  toolSlug:'color-converter',locale:'en',
  seoTitle:'Color Converter – Convert HEX, RGB, HSL, CMYK Color Codes Free',
  seoDescription:'Convert color codes between HEX, RGB, HSL, HSV, and CMYK formats instantly. Essential tool for designers and developers to find the perfect color in any format. Free.',
  pageH1:'Color Converter – Convert HEX, RGB, HSL & CMYK Instantly',
  seoKeywords:['color converter','hex to rgb','rgb to hex','color code converter','hex color converter','rgb color converter','hsl color converter','cmyk color converter','color format converter','hex to hsl','rgb to hsl','color code translator','css color converter','web color converter','color value converter','color picker converter','html color converter','hex color to rgb','rgb to cmyk','color conversion tool'],
  contentBody:`## Color Converter – Every Color Format in One Tool

Designers work in HSL, web developers code in HEX, and print designers need CMYK. Our **Color Converter** instantly translates any color code between all standard formats — eliminating the mental math and lookup tables.

### Supported Color Formats

| Format | Example | Used In |
|---|---|---|
| **HEX** | \`#FF6B35\` | CSS, HTML, design tools |
| **RGB** | \`rgb(255, 107, 53)\` | CSS, JavaScript, screens |
| **RGBA** | \`rgba(255, 107, 53, 0.8)\` | CSS with transparency |
| **HSL** | \`hsl(18, 100%, 60%)\` | CSS, color adjustments |
| **HSLA** | \`hsla(18, 100%, 60%, 0.8)\` | CSS with transparency |
| **HSV/HSB** | \`hsv(18, 79%, 100%)\` | Photoshop, design apps |
| **CMYK** | \`cmyk(0%, 58%, 79%, 0%)\` | Print/offset printing |

### When to Use Each Format

**HEX** — The web standard. Use for CSS colors, HTML attributes, and most design tools. Always 6 or 8 characters (with alpha).

**RGB** — Great for programmatic color manipulation in JavaScript and CSS. Each channel 0–255.

**HSL** — Most human-intuitive format. Hue (color), Saturation (intensity), Lightness (brightness). Perfect for creating color variations: same hue, different lightness.

**CMYK** — Required for print design. Stands for Cyan, Magenta, Yellow, Key (Black). RGB colors can look different when printed — always convert to CMYK for print.

### Pro Tips for Color Conversion

- **Screen to Print**: RGB and HEX are screen formats. Always convert to CMYK before sending files to print
- **Creating shades**: Use HSL — keep H and S constant, vary L for tints/shades
- **Transparency**: Use RGBA or HSLA — the A value is 0 (transparent) to 1 (opaque)`,
  faq:[
    {question:'Why do colors look different in print than on screen?',answer:'Screens use RGB (light-based), while print uses CMYK (ink-based). The color gamuts don\'t perfectly overlap — some bright RGB colors cannot be reproduced in CMYK. Always check CMYK preview before printing.'},
    {question:'What is the difference between HSL and HSV/HSB?',answer:'HSL (Lightness) and HSV/HSB (Value/Brightness) are similar but calculate the brightness component differently. HSL is used in CSS; HSV/HSB is used in most design applications like Photoshop.'},
    {question:'Can I convert transparent colors (with alpha)?',answer:'Yes. Enter RGBA or HSLA values including the alpha channel (0–1) and the converter will translate the alpha value correctly to all supported formats.'},
    {question:'Does this work for CSS named colors like "tomato" or "steelblue"?',answer:'CSS named colors can be entered and converted to their HEX/RGB/HSL equivalents. The converter recognizes all 140 CSS named colors.'},
    {question:'Is this color converter free?',answer:'Yes. Convert unlimited color codes between all formats for free with no registration.'},
  ]
},
{
  toolSlug:'binary-to-text',locale:'en',
  seoTitle:'Binary to Text Converter – Decode Binary Code to Readable Text Free',
  seoDescription:'Convert binary code to text and text to binary instantly. Supports ASCII and Unicode. Essential developer and computer science tool. Free, browser-based, no signup needed.',
  pageH1:'Binary to Text Converter – Translate Binary Code Instantly',
  seoKeywords:['binary to text','binary decoder','text to binary','binary converter','binary code translator','binary to ascii','binary to string','decode binary','encode binary','binary text converter','binary number to text','binary translation','binary to english','convert binary to text','text to binary converter','binary code decoder','binary encoding','binary message decoder','ascii binary converter','binary to readable text'],
  contentBody:`## Binary to Text Converter – Decode the Language of Computers

**Binary code** is the foundation of all digital data — every file, character, and instruction is stored as a sequence of 0s and 1s. Our **Binary to Text Converter** translates between human-readable text and its binary representation instantly.

### How Binary Encoding Works

Each character is represented by its **ASCII** (or Unicode) decimal value, which is then converted to 8-bit binary:

| Character | ASCII | Binary |
|---|---|---|
| A | 65 | 01000001 |
| a | 97 | 01100001 |
| 0 | 48 | 00110000 |
| Space | 32 | 00100000 |

### Binary Number System

Binary is **Base-2** — using only digits 0 and 1. Each position represents a power of 2:

\`\`\`
01000001 = 0×128 + 1×64 + 0×32 + 0×16 + 0×8 + 0×4 + 0×2 + 1×1
         = 64 + 1 = 65 = 'A'
\`\`\`

### How to Convert Binary to Text

1. Paste your binary code (space-separated 8-bit groups recommended)
2. Click **Convert to Text**
3. Get instant decoded output

**Example:**
\`\`\`
Binary: 01001000 01100101 01101100 01101100 01101111
Text:   Hello
\`\`\`

### Common Use Cases

- **Computer science education**: Learn how computers store text
- **Encoding challenges**: CTF (Capture the Flag) security competitions
- **Data forensics**: Analyze raw binary data from files
- **Steganography**: Understand hidden data in binary format
- **Programming**: Debug character encoding issues`,
  faq:[
    {question:'Do binary groups need to be space-separated?',answer:'The converter accepts both space-separated (01000001 01100010) and continuous binary strings (0100000101100010). Space-separated is recommended for clarity.'},
    {question:'Does this support Unicode characters beyond ASCII?',answer:'Yes. The converter supports UTF-8 encoding, allowing conversion of accented characters, emoji, and non-Latin scripts (Devanagari, Arabic, Chinese, etc.).'},
    {question:'What if my binary string has an error?',answer:'If the binary string has an invalid length (not a multiple of 8) or contains characters other than 0 and 1, the converter will show an error and indicate which part is invalid.'},
    {question:'Can I convert text to binary as well?',answer:'Yes. Switch to "Text to Binary" mode to convert any text string into its 8-bit binary representation.'},
    {question:'Is this binary to text converter free?',answer:'Yes. Convert unlimited binary strings for free with no account required.'},
  ]
},
{
  toolSlug:'hex-to-decimal',locale:'en',
  seoTitle:'Hex to Decimal Converter – Convert Hexadecimal to Decimal Free',
  seoDescription:'Convert hexadecimal (Base-16) numbers to decimal (Base-10) and back instantly. Also supports binary and octal conversions. Free number base converter for developers.',
  pageH1:'Hex to Decimal Converter – Instant Number Base Conversion',
  seoKeywords:['hex to decimal','hexadecimal to decimal','hex converter','hex to decimal converter','decimal to hex','hexadecimal converter','base 16 to base 10','hex number converter','convert hex','hex to binary','hex code converter','hexadecimal calculator','hex decimal converter','base conversion tool','number base converter','hex to integer','hex value converter','hexadecimal to number','convert hex to decimal','hex decoder'],
  contentBody:`## Hex to Decimal Converter – Number Base Conversion Made Easy

**Hexadecimal (Base-16)** is the most common number system in computing after binary. Memory addresses, color codes, machine code, and network data are all expressed in hex. Our converter instantly translates between hex, decimal, binary, and octal.

### Number Systems Explained

| Base | Name | Digits Used | Example |
|---|---|---|---|
| 2 | Binary | 0, 1 | 1010 |
| 8 | Octal | 0–7 | 12 |
| 10 | Decimal | 0–9 | 10 |
| 16 | Hexadecimal | 0–9, A–F | A |

### How Hexadecimal Works

Hex uses 16 symbols: 0–9 and A–F (where A=10, B=11, C=12, D=13, E=14, F=15).

**Converting Hex to Decimal:**
\`\`\`
FF = (15 × 16¹) + (15 × 16⁰) = 240 + 15 = 255
1A3 = (1 × 256) + (10 × 16) + (3 × 1) = 256 + 160 + 3 = 419
\`\`\`

### Where Hex Is Used in Computing

- **Colors**: #FF6B35 (hex color codes in CSS/HTML)
- **Memory addresses**: 0x7FFE4000 (RAM locations)
- **MAC addresses**: 00:1A:2B:3C:4D:5E (network hardware IDs)
- **IPv6 addresses**: 2001:0db8:85a3::8a2e:0370:7334
- **ASCII hex**: 48 65 6C 6C 6F = "Hello"
- **Bytecode**: Machine code instructions

### Quick Reference

| Hex | Decimal | Binary |
|---|---|---|
| F | 15 | 1111 |
| FF | 255 | 11111111 |
| 100 | 256 | 100000000 |
| FFFF | 65535 | 1111111111111111 |`,
  faq:[
    {question:'What does "0x" prefix mean in hexadecimal?',answer:'The "0x" prefix is a programming convention to indicate a hexadecimal number. For example, 0xFF means the hex value FF (255 in decimal). The converter accepts values with or without the 0x prefix.'},
    {question:'Can I convert negative hexadecimal numbers?',answer:'Yes. The converter handles negative hex values and two\'s complement representation used in most programming languages.'},
    {question:'What is the largest hex number this tool can convert?',answer:'The converter handles very large numbers including 64-bit integers and beyond, suitable for all programming use cases.'},
    {question:'Can I convert hex color codes to decimal?',answer:'Yes. Enter a hex color code (e.g., FF6B35) and get the decimal equivalent for each channel — useful for programming color values in languages that require decimal RGB.'},
    {question:'Is this hex to decimal converter free?',answer:'Yes. Convert unlimited hex values for free with no account required.'},
  ]
},
{
  toolSlug:'roman-numeral',locale:'en',
  seoTitle:'Roman Numeral Converter – Convert Numbers to Roman Numerals Free',
  seoDescription:'Convert Arabic numbers to Roman numerals and Roman numerals back to numbers instantly. Supports numbers 1–3999. Perfect for dates, outlines, and history. Free tool.',
  pageH1:'Roman Numeral Converter – Arabic to Roman Numbers Instantly',
  seoKeywords:['roman numeral converter','arabic to roman numerals','roman numeral calculator','convert to roman numerals','roman numbers converter','roman numeral translator','number to roman numeral','roman numeral decoder','roman numerals online','roman numeral tool','convert roman numerals','roman numeral generator','roman numeral chart','roman numeral year','year in roman numerals','2024 in roman numerals','roman numeral date converter','what is roman numeral','roman numeral maker free','roman numeral encoder'],
  contentBody:`## Roman Numeral Converter – Ancient Numbers Made Easy

**Roman numerals** are a numeral system originating in ancient Rome that uses combinations of letters from the Latin alphabet. Still widely used today for clock faces, book chapters, movie sequels, Super Bowl numbers, and formal dates.

### Roman Numeral Symbols

| Symbol | Value |
|---|---|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1,000 |

### Subtractive Notation Rules

Roman numerals use subtractive notation for certain combinations:

| Combination | Value |
|---|---|
| IV | 4 (not IIII) |
| IX | 9 (not VIIII) |
| XL | 40 |
| XC | 90 |
| CD | 400 |
| CM | 900 |

### Common Roman Numeral Examples

\`\`\`
2024 = MMXXIV
1776 = MDCCLXXVI
2000 = MM
1999 = MCMXCIX
XIV  = 14
XLII = 42
\`\`\`

### Where Roman Numerals Are Still Used Today

- **Movie sequels**: Star Wars Episode VI, Rocky II, Avengers: Endgame
- **Super Bowl**: Super Bowl LVIII (58)
- **Copyright years**: © MMXXIV
- **Book chapters**: Chapter XII
- **Clocks**: Traditional clock faces use I–XII
- **Outlines**: I. Introduction, II. Methods...
- **Monarchs**: Henry VIII, Elizabeth II`,
  faq:[
    {question:'What is the largest number expressible in Roman numerals?',answer:'Standard Roman numerals go up to 3,999 (MMMCMXCIX). Numbers 4,000 and above require a bar over the numeral (vinculum notation) — not widely supported in standard Roman numeral systems.'},
    {question:'Is there a zero in Roman numerals?',answer:'No. Roman numerals have no symbol for zero. The concept of zero was developed independently by Babylonian and Indian mathematicians and adopted into Arabic numerals.'},
    {question:'How do I write the current year in Roman numerals?',answer:'Enter the year in the converter and get the Roman numeral instantly. For example: 2024 = MMXXIV, 2025 = MMXXV.'},
    {question:'Can this convert Roman numerals back to Arabic numbers?',answer:'Yes. Paste any valid Roman numeral string and the converter will translate it to the corresponding Arabic (decimal) number.'},
    {question:'Is this Roman numeral converter free?',answer:'Yes. Convert unlimited numbers between Arabic and Roman numeral formats for free with no signup.'},
  ]
},
];

const data2 = [
{
  toolSlug:'pdf-to-word',locale:'en',
  seoTitle:'PDF to Word Converter – Convert PDF to Editable DOCX Free Online',
  seoDescription:'Convert PDF files to editable Microsoft Word DOCX documents online. Preserves formatting, tables, and images. Fast, secure, no signup required. Free PDF to Word tool.',
  pageH1:'PDF to Word Converter – Get Editable DOCX From Any PDF Free',
  seoKeywords:['pdf to word','pdf to word converter','convert pdf to word','pdf to docx','pdf to word online','free pdf to word','pdf to word free','convert pdf to docx','pdf to editable word','best pdf to word converter','pdf word conversion','pdf to word document','pdf to microsoft word','pdf converter to word','pdf to word no signup','pdf to doc converter','pdf to word download','pdf convert to word free','pdf to word tool','pdf to word online free'],
  contentBody:`## PDF to Word Converter – Edit Any PDF Document Instantly

PDFs are designed for reading and sharing — not editing. Our **PDF to Word Converter** transforms any PDF into a fully editable Microsoft Word DOCX file, preserving the original formatting, tables, images, and layout as closely as possible.

### Why Convert PDF to Word?

- **Edit content**: Modify text, fix errors, update information
- **Extract text**: Pull content out of scanned or locked PDFs
- **Reformat documents**: Change the layout for a new purpose
- **Repurpose content**: Convert contracts, reports, or presentations for editing

### What Gets Preserved

| Element | Preservation Level |
|---|---|
| Text content | Excellent |
| Text formatting (bold, italic) | Excellent |
| Tables | Very Good |
| Images | Good |
| Complex multi-column layouts | Good |
| Scanned PDFs (OCR required) | Moderate |

### OCR for Scanned PDFs

If your PDF contains scanned images of text (not selectable text), **OCR (Optical Character Recognition)** is needed to extract the text. Our converter includes basic OCR for scanned documents.

### How to Convert PDF to Word

1. Click **Upload PDF** or drag and drop your file
2. Wait for the conversion to process (typically 5–30 seconds)
3. Download your converted Word DOCX file
4. Open in Microsoft Word, Google Docs, or LibreOffice to edit

### Tips for Best Conversion Results

- Use PDFs with selectable text (not scanned images) for best accuracy
- Simple single-column layouts convert more accurately than complex multi-column designs
- Tables with merged cells may require manual adjustment after conversion`,
  faq:[
    {question:'Will the formatting be preserved after conversion?',answer:'Formatting preservation depends on PDF complexity. Simple text documents convert excellently. Complex layouts with multi-column text, unusual fonts, or elaborate graphics may require some manual cleanup in Word.'},
    {question:'Can I convert password-protected PDFs?',answer:'Password-protected PDFs require the password to be entered before conversion. PDFs with "printing only" restrictions cannot be converted without the owner password.'},
    {question:'What is the maximum file size for conversion?',answer:'The converter accepts PDF files up to 50MB. For larger files, compress the PDF first or split it into smaller sections.'},
    {question:'Is the conversion private and secure?',answer:'Yes. Uploaded files are processed securely and automatically deleted after conversion is complete. Files are not stored or shared.'},
    {question:'Is the PDF to Word converter free?',answer:'Yes. Convert PDFs to Word format for free with no account required.'},
  ]
},
{
  toolSlug:'word-to-pdf',locale:'en',
  seoTitle:'Word to PDF Converter – Convert DOC/DOCX to PDF Free Online',
  seoDescription:'Convert Microsoft Word documents to professional PDF files instantly online. Preserve formatting, fonts, and layout. Free Word to PDF converter — no software needed.',
  pageH1:'Word to PDF Converter – Create Professional PDFs From Word Docs',
  seoKeywords:['word to pdf','word to pdf converter','convert word to pdf','doc to pdf','docx to pdf','word to pdf online','free word to pdf','word to pdf free','convert docx to pdf','word document to pdf','microsoft word to pdf','word to pdf no signup','doc to pdf converter','word pdf conversion','word to pdf tool','word to pdf download','convert word file to pdf','online word to pdf','word to pdf converter free','docx to pdf online'],
  contentBody:`## Word to PDF Converter – Professional PDFs From Any Word Document

The **Word to PDF Converter** creates universally compatible PDF files from Microsoft Word documents — preserving your exact formatting, fonts, images, and layout. PDFs look identical on every device and operating system.

### Why Convert Word to PDF?

| Reason | Explanation |
|---|---|
| **Universal compatibility** | PDF opens on any device without Word installed |
| **Formatting preservation** | Layout looks identical on all screens and printers |
| **Professional appearance** | Standard format for resumes, contracts, reports |
| **Non-editable** | Protect your document from unauthorized changes |
| **Smaller file size** | PDFs are often smaller than equivalent DOCX files |

### Supported Input Formats

- **DOCX**: Microsoft Word 2007 and later (recommended)
- **DOC**: Microsoft Word 97–2003
- **ODT**: OpenDocument Text (LibreOffice/Google Docs)
- **RTF**: Rich Text Format

### How to Convert Word to PDF

1. Upload your Word document (drag and drop or click to browse)
2. The converter processes your file instantly
3. Download your PDF — ready to share, print, or sign

### When to Use PDF vs Word

**Use PDF for:**
- Sharing final documents (resumes, proposals, invoices)
- Documents that should look identical everywhere
- Files sent for signing or official submission

**Use Word for:**
- Collaborative editing with track changes
- Documents that need frequent content updates
- Templates that others will fill in`,
  faq:[
    {question:'Will fonts look exactly the same in the PDF?',answer:'Yes, if the fonts are standard system fonts or embedded in the document. Custom or rare fonts that aren\'t available on the server may be substituted, slightly changing the appearance.'},
    {question:'Can I convert a Word document with images and tables?',answer:'Yes. Images, tables, charts, and most formatting elements are preserved in the PDF output. Complex SmartArt or Word-specific objects may render slightly differently.'},
    {question:'Is the converted PDF editable?',answer:'By default, the PDF is not editable. It is a static representation of your document. To create an editable PDF form, use PDF editing software like Adobe Acrobat.'},
    {question:'What is the file size limit?',answer:'Upload Word files up to 50MB. Most typical Word documents are well under this limit — even those with many images.'},
    {question:'Is this Word to PDF converter free?',answer:'Yes. Convert unlimited Word documents to PDF for free with no account required.'},
  ]
},
{
  toolSlug:'merge-pdf',locale:'en',
  seoTitle:'Merge PDF Online – Combine Multiple PDF Files Into One Free',
  seoDescription:'Merge multiple PDF files into a single document online. Drag to reorder pages, combine any number of PDFs instantly. Free, secure, no software download required.',
  pageH1:'Merge PDF – Combine Multiple PDF Files in One Click',
  seoKeywords:['merge pdf','combine pdf','pdf merger','pdf combiner','merge pdf files','combine pdf files','join pdf','merge pdf online','pdf merge tool','combine multiple pdfs','free pdf merger','pdf joiner online','merge pdf free','combine pdf online','pdf combine tool','merge pdfs into one','pdf file merger','pdf merging tool','online pdf combiner','pdf join tool'],
  contentBody:`## Merge PDF – Combine Any Number of PDFs Into One Document

Managing multiple separate PDFs is inefficient. Our **PDF Merger** combines any number of PDF files into a single, organized document — with full control over page order. No software installation, no file size limits that force you to a paid tier.

### Why Merge PDFs?

- **Reports**: Combine cover page, body, and appendices into one file
- **Contracts**: Merge multiple contract pages or attachments
- **Presentations**: Combine slide decks from multiple contributors
- **Portfolios**: Create a single PDF from multiple work samples
- **Invoices**: Combine monthly invoices into a single statement

### How to Merge PDF Files

1. Upload your PDF files (click or drag and drop multiple files)
2. Drag to reorder files in your desired sequence
3. Click **Merge PDFs**
4. Download your combined single PDF file

### Reordering Pages Before Merging

After uploading multiple PDFs, you can:
- Drag files to change their order in the final document
- Preview individual files before merging
- Remove any file you don't want included

### Preserving PDF Quality

Merging PDFs using our tool does NOT reduce quality. The original resolution of text, images, and vector graphics is maintained. The merged PDF is identical in quality to the originals.

### Handling Large PDFs

For PDFs with many pages or high-resolution images, merging may take longer. The tool handles PDFs up to 100MB per file. For very large files, consider compressing PDFs first.`,
  faq:[
    {question:'Is there a limit to how many PDFs I can merge?',answer:'You can merge up to 20 PDF files in a single operation. For merging more files, process them in batches and then merge the resulting PDFs.'},
    {question:'Can I reorder pages from different PDFs?',answer:'You can reorder entire files before merging. For page-level reordering within individual PDFs, use a PDF editor or split the PDF first, then merge specific pages.'},
    {question:'Will the merged PDF maintain bookmarks and hyperlinks?',answer:'Bookmarks from individual PDFs may not transfer. Internal hyperlinks within each document are preserved. Links between merged documents are not automatically created.'},
    {question:'Is my file data secure?',answer:'Files are uploaded over HTTPS, processed on secure servers, and automatically deleted after your download is complete. Files are never shared or retained.'},
    {question:'Is the PDF merger free?',answer:'Yes. Merge unlimited PDF files for free with no account required.'},
  ]
},
{
  toolSlug:'split-pdf',locale:'en',
  seoTitle:'Split PDF Online – Extract Pages From PDF Files Free',
  seoDescription:'Split PDF files into separate pages or extract a specific page range online. Free PDF splitter tool — no software, no signup, no file size limits that force upgrades.',
  pageH1:'Split PDF – Extract Pages and Divide PDF Files for Free',
  seoKeywords:['split pdf','pdf splitter','extract pages from pdf','pdf page extractor','split pdf online','pdf split tool','divide pdf','separate pdf pages','pdf splitter online','split pdf free','extract pdf pages','pdf page splitter','cut pdf pages','pdf split pages','online pdf splitter','pdf separator','split pdf into pages','split pdf document','pdf page extractor online','free pdf splitter'],
  contentBody:`## Split PDF – Divide Any PDF Into Separate Files

Sometimes you only need specific pages from a large PDF — an executive summary, a particular chapter, or a single form. Our **PDF Splitter** extracts exactly the pages you need into a clean, standalone PDF file.

### Split Options Available

| Method | Description |
|---|---|
| **Extract single page** | Download one specific page as a PDF |
| **Extract page range** | Pages 5–12 as a single new PDF |
| **Split every page** | Each page becomes its own PDF file |
| **Split by fixed intervals** | Every N pages as separate PDFs |
| **Custom selection** | Non-consecutive pages (e.g., 1, 3, 7, 15) |

### Common Use Cases

- **Extract a chapter**: Pull pages 45–89 from a textbook PDF
- **Get a specific form**: Extract the one-page form from a multi-page document
- **Remove a page**: Split around an unwanted page and merge the rest
- **Separate invoices**: Split a combined invoice PDF into individual bills
- **Share specific content**: Send only the relevant pages, not the entire document

### How to Split a PDF

1. Upload your PDF file
2. Select split method (by range, every page, or custom)
3. Enter your page selection (e.g., "1-5, 8, 12-15")
4. Click **Split PDF**
5. Download individual pages or a ZIP file containing all splits

### Page Numbering

The PDF splitter uses the document's internal page numbering (1-indexed). The first page is always page 1, regardless of printed page numbers in the document footer.`,
  faq:[
    {question:'Can I extract non-consecutive pages?',answer:'Yes. Enter a custom page selection like "1, 3, 5-8, 12" to extract specific non-consecutive pages into a single new PDF.'},
    {question:'What happens to the original PDF?',answer:'Your original PDF is not modified. The splitter creates new PDF files from the specified pages. Your original file remains unchanged.'},
    {question:'Can I split a password-protected PDF?',answer:'You must enter the PDF password before splitting. PDFs with owner-only permissions that prevent copying may not be splittable without the owner password.'},
    {question:'Is there a page limit for splitting?',answer:'No page limit. The tool handles PDFs with thousands of pages. Very large PDFs may take longer to process.'},
    {question:'Is the PDF splitter free?',answer:'Yes. Split unlimited PDF files for free with no account required.'},
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
