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
  toolSlug:'json-formatter',locale:'en',
  seoTitle:'JSON Formatter & Validator – Clean, Beautify & Debug JSON Online',
  seoDescription:'Clean, format, validate, and beautify your JSON data instantly. Detect syntax errors in real time with our secure, browser-based JSON formatter. 100% free.',
  pageH1:'JSON Formatter & Validator – Beautify and Debug JSON Data',
  seoKeywords:['json formatter','json validator','beautify json','json beautifier','clean json','format json online','validate json','json parser','json checker','json debugger','json formatting tool','format json string','prettify json','online json formatter','minify json','json lint','json syntax checker','json formatting free','json data cleaner','best json formatter'],
  contentBody:`## JSON Formatter & Validator – Prettify and Parse Data Instantly

**JSON (JavaScript Object Notation)** is the industry-standard data format used in APIs, configuration files, and web services. Raw JSON exports are usually minified into a single line, making them extremely difficult to read or debug. Our **JSON Formatter** instantly formats, structures, and validates your JSON data.

### Key Features of the JSON Formatter

- **Syntax Highlighting**: Easily distinguish keys, strings, numbers, and booleans.
- **Collapsible Nodes**: Expand or collapse nested JSON objects and arrays for easier navigation.
- **Real-Time Validation**: Instantly detect syntax errors, missing commas, or mismatched brackets.
- **One-Click Copy**: Copy the clean, prettified JSON back to your clipboard instantly.
- **Browser-Side Processing**: Your data is never sent to a server, ensuring 100% security.

### How to Use the JSON Formatter

1. Paste your raw, minified, or messy JSON into the editor.
2. The tool will automatically detect syntax issues in real time.
3. Click **Format** to clean and indent the JSON block.
4. Click **Minify** if you want to compress it for network transmission.
5. Copy the output or download it as a \`.json\` file.

### Common JSON Errors and How to Fix Them

| Error Type | Example (Invalid) | Correct Format (Valid) |
|---|---|---|
| Missing Quotes | \`{ name: "Aynzo" }\` | \`{ "name": "Aynzo" }\` |
| Trailing Comma | \`[1, 2, 3,]\` | \`[1, 2, 3]\` |
| Mismatched Brackets | \`{ "data": [1, 2 }\` | \`{ "data": [1, 2] }\` |
| Single Quotes | \`{ 'status': 'ok' }\` | \`{ "status": "ok" }\` |`,
  faq:[
    {question:'Why does my JSON fail to parse?',answer:'JSON requires double quotes for all keys and string values. Single quotes, trailing commas, or missing brackets will cause standard JSON parsers to fail.'},
    {question:'Is my JSON data safe and private on your site?',answer:'Yes. The formatting and validation processes happen entirely inside your web browser using JavaScript. No data is sent to our servers.'},
    {question:'Can this tool convert JSON to other formats?',answer:'Yes, we have dedicated tools for JSON to CSV and JSON to TypeScript interfaces available on our platform.'},
    {question:'Does this tool support JSON lines or custom schemas?',answer:'This tool formats standard RFC 8259 JSON objects and arrays. It will flag multi-line JSON Streams as invalid unless they are wrapped in a standard array.'},
    {question:'Is this JSON formatter free?',answer:'Yes, 100% free with no limits on file size or usage.'}
  ]
},
{
  toolSlug:'url-encoder-decoder',locale:'en',
  seoTitle:'URL Encoder & Decoder – Percent-Encoding Tool for Web URLs',
  seoDescription:'Encode or decode strings using RFC 3986 percent-encoding online. Securely translate special characters in query parameters and URLs. Free developer tool.',
  pageH1:'URL Encoder & Decoder – Fast, Secure Percent-Encoding Online',
  seoKeywords:['url encoder','url decoder','percent encoding','encode url string','decode url component','url translation tool','query parameter encoder','url sanitization','url escape characters','unescape url online','url encoder decoder free','percent decoder','developer url tool','base64 vs url encode','url parser','html entity url encoder','url string encoder','url converter','percent encode online','convert string to url'],
  contentBody:`## URL Encoder & Decoder – Standardize and Format Web Links

Web addresses (URLs) can only contain a limited set of ASCII characters. Any special characters, spaces, or non-Latin alphabets must be converted into a safe format called **percent-encoding** or **URL encoding** to prevent web servers and browsers from breaking.

### How URL Encoding Works

URL encoding replaces unsafe or reserved characters with a percent sign (\`%\`) followed by their corresponding two-digit hexadecimal ASCII code.

| Character | Real Meaning | URL Encoded Value |
|---|---|---|
| Space | Word separator | \`%20\` or \`+\` |
| \`/\` | Path separator | \`%2F\` |
| \`?\` | Query string starter | \`%3F\` |
| \`&\` | Query parameter delimiter | \`%26\` |
| \`=\` | Value assignment | \`%3D\` |

### Why URL Encoding Is Essential

When sending data inside query parameters (e.g., \`?query=search term & more\`), the ampersand (\`&\`) could be misinterpreted by the server as a new parameter parameter. Encoding it to \`?query=search%20term%20%26%20more\` guarantees data integrity.

### How to Use the URL Encoder / Decoder

1. Enter your raw query string, URL, or code in the input area.
2. Select **Encode** to escape all special characters.
3. Select **Decode** to revert a percent-encoded string back into human-readable text.
4. Copy the result directly to your code or browser address bar.`,
  faq:[
    {question:'What is percent-encoding?',answer:'Percent-encoding is a mechanism for encoding arbitrary data in a Uniform Resource Identifier (URI) using only the US-ASCII characters allowed in a URL.'},
    {question:'What characters are allowed in a URL without encoding?',answer:'Alphanumeric characters (A-Z, a-z, 0-9) and unreserved symbols (-, _, ., ~) never need to be encoded.'},
    {question:'Is my encoded data secure?',answer:'Yes. Like all our developer tools, URL encoding and decoding are executed purely in your web browser. No data is sent to our servers.'},
    {question:'Can I encode binary files using this tool?',answer:'This tool is designed for text strings and query parameters. For binary data, use our Base64 Encoder.'},
    {question:'Is this tool free?',answer:'Yes, completely free with no usage limits.'}
  ]
},
{
  toolSlug:'html-formatter',locale:'en',
  seoTitle:'HTML Formatter & Beautifier – Clean & Indent HTML Code Free',
  seoDescription:'Beautify, clean, and properly indent your HTML code instantly. Remove messy spaces, format nested tags, and make your markup highly readable. 100% free.',
  pageH1:'HTML Formatter & Beautifier – Clean Up Messy HTML Markup',
  seoKeywords:['html formatter','html beautifier','clean html','format html online','html prettifier','indent html code','beautify html markup','html validator','html code cleaner','minify html','html parser','xhtml formatter','xml to html formatter','html layout cleanup','prettify html markup','best html beautifier','free html code cleaner','online html formatter','html code visualizer','developer html formatter'],
  contentBody:`## HTML Formatter & Beautifier – Enhance Readability of Your Markup

Messy, unindented HTML is a nightmare to maintain. Deeply nested tables, unclosed tags, and inconsistent spacing slow down developers and increase bugs. Our **HTML Formatter** cleans, beautifies, and indents your code instantly to match modern web standards.

### Features of Our HTML Beautifier

- **Custom Indentation**: Choose between tabs, 2 spaces, or 4 spaces.
- **Smart Nesting**: Automatically formats deeply nested containers, tables, lists, and forms.
- **Tag Validation**: Detects basic markup structural problems like unclosed tags.
- **Inline Style Cleanup**: Correctly formats embedded CSS inside \`<style>\` tags.
- **Client-Side Speed**: Super-fast parsing running directly in your browser.

### How to Use the HTML Formatter

1. Paste your messy, minified, or raw HTML markup into the input editor.
2. Select your preferred indentation level (e.g., 2 spaces).
3. Click **Format** to clean up the layout instantly.
4. Copy the formatted markup directly to your source files.`,
  faq:[
    {question:'Will formatting my HTML break my website script tags?',answer:'No. Our formatter parses HTML structures and leaves standard inline JavaScript or script blocks intact without changing their operational logic.'},
    {question:'Does this tool fix unclosed HTML tags?',answer:'It will attempt to indent the structures gracefully. However, for seriously broken HTML, we recommend running it through a validator first.'},
    {question:'What is the difference between Minifying and Beautifying HTML?',answer:'Minification removes all spaces, line breaks, and comments to make files as small as possible. Beautifying adds spaces and structural indentation to make code readable for human developers.'},
    {question:'Can I use this for XHTML files?',answer:'Yes, the parser supports standard XHTML syntax as well.'},
    {question:'Is this HTML formatter free?',answer:'Yes, it is completely free to use with no registrations required.'}
  ]
},
{
  toolSlug:'css-formatter',locale:'en',
  seoTitle:'CSS Formatter & Beautifier – Clean, Indent & Prettify Stylesheets',
  seoDescription:'Beautify and clean up messy CSS stylesheets instantly. Format selectors, properties, media queries, and nested rules to maximize stylesheet readability. Free.',
  pageH1:'CSS Formatter & Beautifier – Organize and Indent Your Stylesheets',
  seoKeywords:['css formatter','css beautifier','clean css','format css online','css prettifier','beautify css stylesheet','css style cleaner','minify css','format css code','css validator','css style formatter','css visualizer','prettify css stylesheet','online css beautifier','developer css tool','sass vs css formatter','tailwind css formatter','responsive css formatter','css code clean','css formatting tool'],
  contentBody:`## CSS Formatter & Beautifier – Maximize Stylesheet Maintainability

Large CSS files easily become disorganized with mismatched indentation, inconsistently placed brackets, and chaotic property lists. Our **CSS Formatter** formats your selectors, rules, declarations, and media queries into a consistent, easily readable style.

### Why Format Your CSS?

- **Improved Readability**: Consistent line breaks and indentation make rules easy to scan.
- **Easier Debugging**: Clear separation of selectors and values helps you pinpoint layout overrides.
- **Smaller Git Diffs**: Standardized styles ensure version control systems highlight actual code changes, not spacing changes.
- **Optimized Performance**: Clean up comments and redundant spacing during development before building production bundles.

### Features of Our CSS Beautifier

- **Brace Styles**: Choose between standard newline or inline brackets.
- **Property Sorting**: Keep rules clean with standardized property layouts.
- **Nested Media Queries**: Gracefully formats responsive code blocks.
- **Direct Clipboard Integration**: Copy your beautified CSS with a single click.`,
  faq:[
    {question:'Does this tool compress or minify my CSS?',answer:'This tool is a beautifier designed for human readability. If you need to prepare files for deployment, use our CSS Minifier instead.'},
    {question:'Does this formatter support SASS, SCSS, or LESS?',answer:'This tool is optimized for standard CSS. Basic SCSS stylesheets will work, but complex nesting, mixins, or control structures should be formatted using specialized SASS tools.'},
    {question:'Will this format CSS in custom HTML files?',answer:'This formatter targets CSS syntax specifically. For HTML files containing styles, use our HTML Formatter.'},
    {question:'Is my code secure?',answer:'Yes, all processing takes place locally inside your browser.'},
    {question:'Is this tool free?',answer:'Yes, completely free with no limits.'}
  ]
},
{
  toolSlug:'javascript-formatter',locale:'en',
  seoTitle:'JavaScript Formatter – Beautify, Clean & Indent JS Code Free',
  seoDescription:'Beautify and format messy JavaScript and ES6+ code online. Choose custom spacing, bracket placement, and make your scripts readable instantly. 100% free.',
  pageH1:'JavaScript Formatter – Format and Clean Up JS Code Instantly',
  seoKeywords:['javascript formatter','js formatter','beautify javascript','js beautifier','clean js code','format javascript online','js prettifier','indent javascript code','minify js','javascript formatting tool','beautify js script','javascript code cleaner','eslint formatter','prettier online','js code visualizer','es6 formatter','free javascript beautifier','online javascript formatter','developer js tool','minify javascript'],
  contentBody:`## JavaScript Formatter – Prettify Your Scripts and Codeblocks

Raw or compressed JavaScript can be nearly impossible to read. Our **JavaScript Formatter** acts like Prettier in the cloud — formatting variables, functions, closures, promises, loops, and modern ES6+ structures into beautiful, standardized, and clean code.

### Custom Formatting Settings

Customize your output to match your team's coding conventions:

- **Indent Size**: Choose 2 spaces, 4 spaces, or tabs.
- **Semicolons**: Choose whether to enforce or remove trailing semicolons.
- **Quotes**: Single quotes vs double quotes consistency.
- **Bracket Spacing**: Add spaces inside curly brackets.

### Why Clean JS Code Matters

- **Code Audits**: Easily scan files for security flaws or logical errors.
- **Fewer Typos**: Readable layouts make missing parenthesis or brackets immediately obvious.
- **Faster Onboarding**: Standardized code styles help new developers understand logic instantly.
- **Maintenance**: Standard formatting makes refactoring complex functions simple.`,
  faq:[
    {question:'Will this tool check my JavaScript code for bugs?',answer:'This tool is a code beautifier, not a linter. For syntax checking and bug detection, use ESLint.'},
    {question:'Does this tool support TypeScript or JSX?',answer:'This tool supports standard JavaScript (ES5, ES6, ES7+). For JSX, you can use our HTML to JSX converter.'},
    {question:'Is my proprietary JS code kept safe?',answer:'Yes. All operations run strictly on your browser using JS engines, so nothing is sent to our servers.'},
    {question:'Can I minify code with this?',answer:'No, this tool formats code for humans. For minification, use our Code Minifier.'},
    {question:'Is this tool free?',answer:'Yes, completely free.'}
  ]
},
{
  toolSlug:'xml-formatter',locale:'en',
  seoTitle:'XML Formatter & Beautifier – Clean & Indent XML Data Free',
  seoDescription:'Beautify, clean, and format messy XML documents instantly. Validate tags, indent hierarchies, and organize structured data. Free online XML tool.',
  pageH1:'XML Formatter & Beautifier – Prettify and Clean XML Markup',
  seoKeywords:['xml formatter','xml beautifier','clean xml','format xml online','xml prettifier','indent xml code','beautify xml document','xml tag validator','minify xml','xml database formatter','xml schemas','online xml formatter','free xml beautifier','xml parser','best xml formatter','xhtml vs xml formatter','xml file cleaner','xml visualizer','developer xml tool','format xml string'],
  contentBody:`## XML Formatter & Beautifier – Organize and Indent XML Data

**XML (eXtensible Markup Language)** remains a heavy favorite for config files, RSS feeds, legacy systems, and SOAP APIs. Raw XML is often packed tightly into single lines to save bandwidth, making manual reading impossible. Our **XML Formatter** restores hierarchy and formatting instantly.

### When to Use XML Formatter

- **API Integration**: Parse and format XML responses from soap services.
- **Configuration Tweaks**: Clean up complex config files like \`pom.xml\` or Android manifests.
- **Sitemap Audits**: Format XML sitemaps to verify URL structure and tags.
- **Data Migrations**: Debug structured XML database dumps before imports.

### Features of the XML Prettifier

- **High-Precision Indentation**: Automatically nests nodes, namespaces, attributes, and tags.
- **Real-Time Diagnostics**: Identifies structural problems like mismatched closing tags.
- **Compact View Option**: Minify XML to save bytes for system uploads.
- **100% Privacy**: Client-side execution protects confidential configurations.`,
  faq:[
    {question:'What makes a valid XML document?',answer:'XML requires a single root element, strictly matched closing tags, case-sensitive tags, and properly quoted attribute values.'},
    {question:'Does this tool support formatting XHTML files?',answer:'Yes, standard XHTML files follow XML guidelines and can be parsed and formatted cleanly by this tool.'},
    {question:'Is my private XML data secure?',answer:'Yes, all processing takes place locally inside your browser.'},
    {question:'Can this tool compress XML files?',answer:'Yes. You can switch modes to minify your XML, removing unnecessary spacing.'},
    {question:'Is this XML formatter free?',answer:'Yes, completely free with no usage limits.'}
  ]
},
];

const data2 = [
{
  toolSlug:'sql-formatter',locale:'en',
  seoTitle:'SQL Formatter & Beautifier – Format & Clean SQL Queries Free',
  seoDescription:'Beautify, clean, and properly indent your SQL queries online. Supports MySQL, PostgreSQL, Oracle, SQLite, and SQL Server. Free database tool.',
  pageH1:'SQL Formatter & Beautifier – Clean Up Database Queries Instantly',
  seoKeywords:['sql formatter','sql beautifier','clean sql query','format sql online','sql prettifier','indent sql query','beautify sql syntax','mysql formatter','postgresql formatter','oracle sql formatter','sqlite query clean','sql query cleaner','minify sql','sql parser','best sql formatter','online sql query format','free sql beautifier','developer database tools','format sql string','sql query visualizer'],
  contentBody:`## SQL Formatter & Beautifier – Organize Database Queries for Readability

Writing complex database queries with multiple joins, nested subqueries, and compound WHERE clauses can quickly result in a wall of unreadable text. Our **SQL Formatter** automatically tidies, nests, and structures your SQL statements according to database best practices.

### Supported SQL Dialects

- **MySQL & MariaDB**: Perfect formatting for standard open-source database queries.
- **PostgreSQL**: Full support for complex PgSQL types, window functions, and operators.
- **T-SQL / MS SQL Server**: Formats Microsoft SQL Server specific query blocks.
- **Oracle PL/SQL**: Handles Oracle database triggers, procedures, and statements.
- **SQLite**: Simple, quick formatting for lightweight database scripts.

### Why You Should Format Your SQL Queries

- **Identify Missing Elements**: Missing commas, unclosed brackets, or logical flaws become obvious in structured code.
- **Optimize Joins**: Nesting JOIN statements and subqueries makes query execution flow clear.
- **Easier Team Reviews**: Standardized SQL styles ensure team PRs are clean and simple to review.
- **Speed Up Refactoring**: Modify columns, conditions, or table joins easily when every statement is on its own line.`,
  faq:[
    {question:'Will formatting my query alter how it runs?',answer:'No. SQL formatting only adjusts spacing, casing, and line breaks. It does not modify column names, variables, logical structures, or table references.'},
    {question:'Does this tool support keywords capitalization?',answer:'Yes. You can automatically capitalize SQL standard keywords (SELECT, FROM, JOIN, WHERE) for a standardized, professional layout.'},
    {question:'Is my SQL data safe from being recorded?',answer:'Yes. Your database structures, query logic, and table names never leave your computer. Everything runs inside your browser.'},
    {question:'Can I format non-SELECT SQL queries?',answer:'Yes, the tool formats INSERT, UPDATE, DELETE, CREATE TABLE, and ALTER queries cleanly.'},
    {question:'Is this SQL formatter free?',answer:'Yes, 100% free with no registration required.'}
  ]
},
{
  toolSlug:'markdown-to-html',locale:'en',
  seoTitle:'Markdown to HTML Converter – Convert MD files to HTML Free',
  seoDescription:'Instantly convert Markdown text (.md) into clean, standard HTML code. Get instant visual previews. Free browser-based markdown translator for content writers.',
  pageH1:'Markdown to HTML Converter – Convert MD syntax to HTML Markup',
  seoKeywords:['markdown to html','convert markdown to html','md to html converter','markdown translator','markdown to html online','free markdown converter','render markdown as html','gfm markdown to html','github flavored markdown','convert md file to html','markdown formatting tool','markdown text parser','html markup generator','wysiwyg markdown html','online md converter','developer markdown tool','blog content writer tool','convert markdown code','markdown to html extension','convert readme to html'],
  contentBody:`## Markdown to HTML Converter – Transform Text into Web Markup

**Markdown** is the most popular markup language for content writers, bloggers, and developers. It's clean, lightweight, and lets you write fast. However, web browsers only understand HTML. Our **Markdown to HTML Converter** bridges this gap, translating Markdown text into valid, compliant HTML markup in real time.

### Supported Markdown Syntax

- **Headers**: \`# H1\`, \`## H2\`, \`### H3\`
- **Styling**: \`**Bold**\`, \`*Italic*\`, \`~~Strikethrough~~\`
- **Lists**: Ordered lists (\`1. \`) and unordered lists (\`- \` or \`* \`)
- **Code Blocks**: Inline code (\`\` \`code\` \`\`) and fenced code blocks with language highlighting.
- **Elements**: Hyperlinks (\`[text](url)\`), images (\`![alt](url)\`), blockquotes (\`> quote\`), and horizontal rules.
- **GitHub Flavored Markdown (GFM)**: Supports tables, task lists, and autolinks.

### How to Use the Markdown Converter

1. Write or paste your Markdown content into the input pane.
2. The HTML code and live preview will render simultaneously.
3. Click **Copy HTML** to get clean, semantic code.
4. Or preview how it will appear on a live webpage in the preview window.`,
  faq:[
    {question:'Does this tool support GitHub Flavored Markdown (GFM)?',answer:'Yes. It supports tables, task lists, strikethroughs, and standard code blocks used across GitHub repositories.'},
    {question:'Can I convert full README.md files?',answer:'Yes. Simply paste the full contents of your README.md file to get the complete converted HTML code instantly.'},
    {question:'Is my content processed securely?',answer:'Yes, the parser runs entirely on the client side using JavaScript. No text is uploaded to our servers.'},
    {question:'Does the converted HTML contain inline CSS styling?',answer:'No, it produces clean, standard semantic HTML tags (like <h1>, <p>, <ul>). You can style them using your own stylesheet.'},
    {question:'Is this Markdown converter free?',answer:'Yes, completely free with no limits.'}
  ]
},
{
  toolSlug:'html-to-markdown',locale:'en',
  seoTitle:'HTML to Markdown Converter – Translate HTML Markup to MD Free',
  seoDescription:'Convert HTML code or page source back into clean, readable Markdown syntax instantly. Perfect for migrating content to static site generators. Free.',
  pageH1:'HTML to Markdown Converter – Clean Up Markup Into MD Syntax',
  seoKeywords:['html to markdown','convert html to markdown','html to md converter','html code translator','html to markdown online','free html to md converter','convert html file to markdown','html markdown parsing','extract markdown from web','wordpress html to markdown','wysiwyg html md','online html converter','developer markdown tool','blog content migration','convert rich text to markdown','reverse markdown parser','gfm markdown generator','clean html markup','convert webpage to markdown','html clean to md'],
  contentBody:`## HTML to Markdown Converter – Simplify Your Web Content

Migrating a legacy website to a modern static site generator (like Jekyll, Hugo, Astro, or Next.js) requires converting raw, cluttered HTML content back into clean, simple **Markdown (.md)** files. Our **HTML to Markdown Converter** automatically translates nested tags into clean, human-readable MD code.

### Features of Our Converter

- **Semantic Tag Translations**: Correctly converts \`<h1>\` to \`#\`, \`<strong>\` to \`**\`, and \`<a>\` to \`[text](url)\`.
- **Table Translations**: Gracefully translates standard HTML \`<table>\` structures into Markdown table syntax.
- **Code Block Extraction**: Converts \`<pre><code>\` blocks into clean, fenced markdown blocks.
- **Messy Tag Elimination**: Automatically ignores layout tags like \`<div>\` or \`<span>\` to leave you with clean content.

### How to Use the HTML to Markdown Converter

1. Paste your HTML source code into the editor.
2. The tool instantly parses the tags and displays the Markdown code.
3. Copy the clean Markdown code and paste it into your local \`.md\` file.`,
  faq:[
    {question:'Does this tool handle nested lists?',answer:'Yes. It parses and maintains indentation for nested ordered and unordered lists during translation.'},
    {question:'Can I paste full website HTML pages?',answer:'Yes. However, we recommend pasting only the main content section (like <article> or <main>) for cleaner Markdown outputs without navigation blocks.'},
    {question:'Is this tool safe for sensitive documentation?',answer:'Yes. The HTML parsing is done locally in your browser. Your markup is never transmitted to our servers.'},
    {question:'Will it convert custom inline styles?',answer:'No. Markdown does not support custom inline CSS styles. These styles will be discarded to ensure standard, clean MD code.'},
    {question:'Is this tool free?',answer:'Yes, 100% free with no registration.'}
  ]
},
{
  toolSlug:'csv-to-json',locale:'en',
  seoTitle:'CSV to JSON Converter – Convert Spreadsheet Data to JSON Free',
  seoDescription:'Instantly convert CSV files and Excel exports into structured JSON format. Customize column mapping and nesting styles. Free online developer tool.',
  pageH1:'CSV to JSON Converter – Convert Spreadsheets to API Data',
  seoKeywords:['csv to json','convert csv to json','csv to json converter','excel to json','spreadsheet to json','csv to structured data','csv json online','free csv to json','convert csv file to json','csv parser','tsv to json','csv data importer','csv to json api','convert xlsx to json','csv to json tool','online csv converter','developer json tool','csv file to json converter','best csv to json','csv formatting tool'],
  contentBody:`## CSV to JSON Converter – Bridge Spreadsheets and APIs

Data analysts and spreadsheet users love **CSV (Comma-Separated Values)**, but modern web applications and APIs exclusively speak **JSON**. Our **CSV to JSON Converter** bridges this gap, allowing you to instantly turn any spreadsheet export or CSV table into a clean, structured JSON object or array.

### Custom Conversion Configurations

- **Delimiters**: Supports commas (\`,\`), semicolons (\`;\`), tabs (\`\\t\`), and pipes (\`|\`).
- **Header Parsing**: Automatically uses the first row of your CSV as JSON keys.
- **Data Types**: Intelligently parses numeric values and booleans instead of treating everything as a string.
- **Output Formats**: Choose between a standard Array of Objects or a Minified JSON string.

### How to Convert CSV to JSON

1. Upload your \`.csv\` file, or paste your raw CSV data into the input field.
2. Select your delimiter (usually the tool auto-detects it).
3. Check the preview to verify the JSON structure.
4. Click **Convert** and copy the output or download the file.`,
  faq:[
    {question:'What delimiter types does this tool support?',answer:'It supports Commas, Semicolons, Tabs, Pipes, and custom delimiters. Auto-detection is enabled by default.'},
    {question:'Does this tool support nested JSON structures?',answer:'By default, it creates flat objects. However, you can use dot notation in your CSV headers (e.g., "user.name", "user.email") to auto-generate nested JSON blocks.'},
    {question:'Is my upload secure?',answer:'Yes. Your files are parsed locally inside your browser memory. We never store or upload your CSV files.'},
    {question:'Can I convert TSV (Tab-Separated Values) files?',answer:'Yes. Simply select the Tab delimiter option to process TSV files.'},
    {question:'Is this CSV to JSON converter free?',answer:'Yes, completely free with no file size limits.'}
  ]
},
{
  toolSlug:'json-to-csv',locale:'en',
  seoTitle:'JSON to CSV Converter – Convert API JSON Data to Spreadsheet Free',
  seoDescription:'Convert JSON objects and arrays into spreadsheet-ready CSV or Excel format instantly. Flatten nested JSON data and download your file for free.',
  pageH1:'JSON to CSV Converter – Convert JSON Arrays to Spreadsheets',
  seoKeywords:['json to csv','convert json to csv','json to csv converter','json to excel','api to csv','json data to spreadsheet','json csv online','free json to csv','convert json file to csv','json flattener','json parser','nested json to csv','export json to csv','convert json to xlsx','json to csv tool','online json converter','developer csv tool','json to spreadsheet converter','best json to csv','json formatting tool'],
  contentBody:`## JSON to CSV Converter – Export API Data directly to Excel

Web services, databases, and APIs export data in **JSON** formats, which are great for code but terrible for business analysis or spreadsheet reporting. Our **JSON to CSV Converter** flattens structured JSON arrays into clean rows and columns, making them instantly readable in Excel, Google Sheets, or Numbers.

### Handling Nested JSON Structures

One of the biggest challenges of converting JSON to CSV is handling nested objects and arrays. Our smart converter:

- **Auto-Flattens Objects**: Converts \`{ "user": { "name": "Nakul" } }\` into a single column named \`user.name\`.
- **Stringifies Arrays**: Converts lists of items inside objects into a readable comma-separated string value within the column.
- **Maintains Relationships**: Correctly maps complex data relationships into standard relational flat structures.

### How to Convert JSON to CSV

1. Paste your JSON array into the editor, or upload a \`.json\` file.
2. The tool will parse and preview the structural fields.
3. Click **Convert to CSV** to compile the rows.
4. Download the output as a \`.csv\` file or copy it directly to Excel.`,
  faq:[
    {question:'Does the JSON need to be an array of objects?',answer:'Yes. To convert JSON into rows and columns, the root element should ideally be an array containing objects of similar structures.'},
    {question:'How does this tool handle nested data?',answer:'It auto-flattens objects using dot notation (e.g., "address.city"). Arrays are converted into comma-separated strings inside a single cell.'},
    {question:'Can I download this as an Excel file?',answer:'The tool downloads standard .csv files, which open natively in Microsoft Excel, Google Sheets, and LibreOffice.'},
    {question:'Is my API data kept secure?',answer:'Yes. No data is sent to our servers. All parsing and conversion are handled inside your web browser.'},
    {question:'Is this JSON to CSV converter free?',answer:'Yes, 100% free with no usage limits.'}
  ]
},
{
  toolSlug:'code-minifier',locale:'en',
  seoTitle:'Code Minifier – Compress HTML, CSS & JavaScript Free Online',
  seoDescription:'Minify and compress your HTML, CSS, and JS files instantly. Remove comments, whitespace, and optimize file sizes to boost webpage speed. 100% free.',
  pageH1:'Code Minifier & Compressor – Boost Web Performance Instantly',
  seoKeywords:['code minifier','compress html','minify css','minify javascript','compress js','code optimizer','web performance tool','remove whitespace code','compress css online','uglify js','minify html free','speed up website tool','code size reducer','minify stylesheet','compress script','developer performance tools','production build optimizer','minify html css js','online code compressor','code minifier free'],
  contentBody:`## Code Minifier – Boost Site Speed by Compressing Asset Files

Page load speed is a critical ranking factor for search engines and plays a massive role in user retention. Every space, tab, line break, and comment in your production HTML, CSS, and JavaScript files adds unnecessary bytes that slow down visitors. Our **Code Minifier** removes these redundancies, shrinking your files for peak performance.

### Expected Compression Rates

| Language | Typical File Size Reduction | Speed Improvement |
|---|---|---|
| HTML | 10% – 20% | Moderate |
| CSS | 20% – 40% | High |
| JavaScript | 30% – 50% | Critical |

### What Our Code Minifier Does

- **Removes Whitespace**: Strips all spaces, tabs, and newlines that aren't critical to syntax.
- **Deletes Comments**: Removes developmental remarks, debug markers, and logs from public assets.
- **Optimizes Selectors & Syntax**: Shrinks colors, shortens properties, and optimizes rules where safe.
- **Preserves Critical Code**: Leaves layout semantics, function logic, and licensing blocks intact.

### How to Use the Code Minifier

1. Select the tab matching your file type (HTML, CSS, or JS).
2. Paste your raw, readable source code in the input editor.
3. Click **Minify** to compress the code instantly.
4. Copy the optimized output or save the file to your deploy directory.`,
  faq:[
    {question:'Is my minified code fully operational?',answer:'Yes. The minifier is designed to optimize code while strictly adhering to language specifications. Your scripts, layouts, and styles will run identically.'},
    {question:'What is the difference between Minifying and Obfuscating?',answer:'Minification removes spaces and comments to reduce file size. Obfuscation goes further, renaming variables and functions to make the code unreadable to humans, preventing reverse-engineering.'},
    {question:'Should I minify during development?',answer:'Always write readable code during development. Run this minifier during your build or deployment step to optimize assets for production.'},
    {question:'Is my code upload secure?',answer:'Yes. The minification is computed on the fly in your local browser sandbox. Your proprietary source code is safe.'},
    {question:'Is this code minifier free?',answer:'Yes, 100% free with no limits.'}
  ]
},
];


const data3 = [
{
  toolSlug:'diff-checker',locale:'en',
  seoTitle:'Diff Checker – Compare Two Text Files Online for Free',
  seoDescription:'Instantly compare two text files or code snippets to find differences. Highlight changes, additions, and deletions in real time. Free online diff tool.',
  pageH1:'Diff Checker – Compare Text and Code Snippets Online',
  seoKeywords:['diff checker','compare text','text comparison tool','code comparison','diff tool online','compare two files','find differences in text','file compare free','highlight text changes','merge diff online','git diff checker online','visual text compare','diff generator','best diff checker','online text comparator','source code comparison','compare code blocks','text diff checker','diff checker free','developer diff tool'],
  contentBody:`## Diff Checker – Compare Text & Code Snippets Instantly

Whether you're merging code branches, proofreading draft translations, auditing config files, or finding copy changes, manually scanning two files side by side is tedious and error-prone. Our **Diff Checker** highlights exact differences, edits, additions, and deletions in a clean, visual layout.

### Visual Comparison Modes

- **Side-by-Side View**: Compare Original and Modified text in twin parallel panes — perfect for standard code audits.
- **Inline/Unified View**: View all changes merged into a single timeline where additions are green and deletions are red — great for code revisions.
- **Word-Level Highlighting**: Pinpoints exact edits inside lines instead of just highlighting the entire row.

### How to Use the Diff Checker

1. Paste your original/source text in the **Left Pane** (Original).
2. Paste your edited/updated text in the **Right Pane** (Modified).
3. The tool will instantly compute differences in real time.
4. Review highlighted edits (Red for deletions, Green for additions).`,
  faq:[
    {question:'What is a Diff Checker used for?',answer:'It is used to quickly identify differences between two revisions of text, source code files, configurations, or documents.'},
    {question:'Can I compare binary files (like PDF or Word)?',answer:'This tool is optimized for plain text, CSVs, markdown, and source code. For PDF or Word docs, copy-paste the text content into the comparison windows.'},
    {question:'Is my sensitive code uploaded to any external server?',answer:'No. The difference algorithm is computed in your browser using local JavaScript engines. Your proprietary code is kept confidential.'},
    {question:'Does this tool show word-level changes?',answer:'Yes. In addition to highlighting changed lines, the tool pinpoints exact modified words inside each line.'},
    {question:'Is this diff checker free?',answer:'Yes, 100% free with no limits.'}
  ]
},
{
  toolSlug:'regex-tester',locale:'en',
  seoTitle:'Regex Tester & Debugger – Test Regular Expressions Free Online',
  seoDescription:'Test and debug your regular expressions with real-time matching, groups extraction, and syntax highlighting. Supports JavaScript regex flavor. Free.',
  pageH1:'Regex Tester & Debugger – Write and Test Regular Expressions',
  seoKeywords:['regex tester','regex debugger','test regular expressions','regex evaluator online','javascript regex tester','regex builder','regex match checker','regular expression evaluator','regex expression tester','regex matching tool','interactive regex tester','regex group extractor','free regex debugger','online regex parser','developer regex tools','regex cheat sheet','regex replace tool','validate regex online','best regex tester','regex validator'],
  contentBody:`## Regex Tester & Debugger – Master the Power of Pattern Matching

**Regular Expressions (Regex)** are incredibly powerful for parsing text, validating forms, and cleaning datasets. However, because of their complex, compact syntax, writing regex expressions often leads to bugs. Our **Regex Tester** lets you construct, test, and debug patterns in real time.

### Supported Flags

- **Global (g)**: Test for multiple matches across the entire string.
- **Case-Insensitive (i)**: Matches letters regardless of uppercase or lowercase settings.
- **Multiline (m)**: Treats start (\`^\`) and end (\`$\`) anchors as lines rather than entire text.
- **Single-line (s)**: Allows dot (\`.\`) character to match newline characters.

### Common Regex Examples to Test

- **Email Validation**: \`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/\`
- **Phone Number (US)**: \`/^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/\`
- **Alphanumeric Only**: \`/^[a-zA-Z0-9]+$/\`
- **Date (YYYY-MM-DD)**: \`/^\\d{4}-\\d{2}-\\d{2}$/\`

### How to Use the Regex Tester

1. Type your regular expression pattern in the **Regex Input** field.
2. Select your desired flags (g, i, m, s).
3. Paste your test string in the **Test String** panel.
4. Watch matching sections highlight in real time, and inspect captured groups instantly.`,
  faq:[
    {question:'What regex engine does this tool run?',answer:'It runs the native JavaScript RegExp engine in your browser, which supports almost all standard ECMAScript regular expression features.'},
    {question:'Does this tool explain what my regex does?',answer:'It provides syntax highlighting and highlights captured groups in color-coded blocks so you can visualize the matching patterns instantly.'},
    {question:'Is my test data uploaded?',answer:'No, everything is processed locally in your browser sandbox.'},
    {question:'Can I perform search and replace with regex?',answer:'Yes, the tool has a dedicated Replace tab where you can test replacement strings in real time.'},
    {question:'Is this regex tester free?',answer:'Yes, completely free with no usage caps.'}
  ]
},
{
  toolSlug:'user-agent-parser',locale:'en',
  seoTitle:'User-Agent Parser – Analyze & Parse HTTP User-Agent Strings Free',
  seoDescription:'Instantly decode and parse any browser User-Agent string. Identify browser name, OS version, engine, and device type. Free online developer tool.',
  pageH1:'User-Agent Parser – Extract Browser, OS, and Device Details',
  seoKeywords:['user agent parser','parse user agent','decode user agent string','user agent analyzer','browser detection tool','useragent parsing online','detect browser os device','identify mobile vs desktop','user agent lookup','free user agent parser','developer user agent tool','http header parser','user agent string decoder','bot detection regex','parse request headers','online useragent details','extract browser version','os detector online','best user agent parser','user agent analysis'],
  contentBody:`## User-Agent Parser – Break Down HTTP Browser Identity Strings

Every HTTP request sent by a browser, app, or bot contains a **User-Agent** header string. This string contains important identity information about the visitor's software environment, but it is notoriously messy and difficult to parse with simple scripts. Our **User-Agent Parser** instantly decodes and structures any User-Agent string.

### What the User-Agent Parser Extracts

- **Browser**: Chrome, Firefox, Safari, Edge, Opera, etc. (including exact versions).
- **Operating System**: Windows, macOS, Linux, Android, iOS (along with version details).
- **Device Type**: Mobile, Tablet, Desktop, SmartTV, or Console.
- **Rendering Engine**: Blink, WebKit, Gecko, Trident, etc.
- **Bot Detection**: Identifies search engine spiders (Googlebot, Bingbot) and AI scrapers.

### How to Parse a User-Agent String

1. Paste any User-Agent string in the search input (the tool automatically populates your current browser's User-Agent as a helpful reference).
2. Click **Parse** to run the parsing rules.
3. Review structured tables breaking down the exact version, platform, engine, and device types.`,
  faq:[
    {question:'What is a User-Agent string?',answer:'A User-Agent is an HTTP request header string that web browsers send to websites to identify their software, version, rendering engine, and operating system.'},
    {question:'Why are User-Agent strings so complicated?',answer:'For historical compatibility, browsers added keywords of competitors (e.g., Chrome includes "Safari" and "AppleWebKit") to bypass server-side agent checks. This makes parsing very complex.'},
    {question:'Can this tool detect crawler bots?',answer:'Yes. It checks against known patterns to identify search engine crawlers (Google, Bing) and developer scrapers.'},
    {question:'Is my browser User-Agent recorded?',answer:'No, parsing is executed entirely locally inside your browser.'},
    {question:'Is this User-Agent parser free?',answer:'Yes, 100% free with no registration.'}
  ]
},
{
  toolSlug:'html-to-jsx',locale:'en',
  seoTitle:'HTML to JSX Converter – Convert HTML Markup to React JSX Free',
  seoDescription:'Instantly convert standard HTML markup into React-compliant JSX code. Auto-translates class, style, and self-closing tags. Free developer tool.',
  pageH1:'HTML to JSX Converter – Migrate Web Templates to React',
  seoKeywords:['html to jsx','convert html to jsx','html to jsx converter','react jsx converter','standard html to react','convert html markup to jsx','auto format jsx','react style converter','class to classname jsx','self closing tags react','html jsx translator','free html to jsx','online react converter','developer react tools','jsx markup generator','migrate html to react','svg to jsx online','html string to jsx','best html to jsx','jsx formatting tool'],
  contentBody:`## HTML to JSX Converter – Accelerate Your Transition to React

When migrating templates, legacy pages, or dashboard UI elements into **React (or Next.js)**, you quickly discover that standard HTML cannot be pasted directly into React components. JSX follows strict XML rules and uses camelCase JavaScript attributes. Our **HTML to JSX Converter** handles these transitions automatically.

### Key Conversion Rules Handled

- **Attribute Mapping**: Automatically translates \`class\` to \`className\` and \`for\` to \`htmlFor\`.
- **Inline Styles**: Converts standard style strings like \`style="color: red; margin-top: 10px"\` into React objects: \`style={{ color: 'red', marginTop: '10px' }}\`.
- **Self-Closing Tags**: Ensures all self-closing tags like \`<input>\`, \`<img>\`, or \`<br>\` are properly closed as \`<input />\`, \`<img />\`, and \`<br />\`.
- **Reserved Words**: Translates custom key parameters to React equivalents to prevent runtime console warnings.

### How to Convert HTML to JSX

1. Paste your raw, standard HTML template markup in the input pane.
2. Select options (e.g., whether to output a functional component wrapper).
3. The converter parses the DOM structures and outputs clean React JSX.
4. Copy the JSX directly to your React components.`,
  faq:[
    {question:'Why can\'t I use standard HTML classes in React?',answer:'React JSX is an extension of JavaScript. Since "class" is a reserved keyword in JavaScript, React uses the "className" attribute instead to define CSS classes.'},
    {question:'Does this tool support SVG conversion?',answer:'Yes, it translates SVG tags and elements (like clip-path, stroke-width) into their correct React camelCase equivalents.'},
    {question:'Is my code secure?',answer:'Yes, all processing takes place locally inside your browser.'},
    {question:'Does it wrap the output in a functional component?',answer:'Yes, you can toggle an option to wrap the JSX in a React functional component structure.'},
    {question:'Is this HTML to JSX converter free?',answer:'Yes, 100% free with no registration.'}
  ]
},
{
  toolSlug:'crontab-generator',locale:'en',
  seoTitle:'Crontab Generator – Create Cron Job Schedules Online Free',
  seoDescription:'Generate crontab schedule expressions easily. Build cron expressions for backups, scripts, and server cron jobs with visual selections. Free.',
  pageH1:'Crontab Generator – Build Cron Job Schedules Visually',
  seoKeywords:['crontab generator','cron job generator','crontab schedule creator','generate cron expression','cron calculator','visual cron maker','linux cron scheduler','crontab expression tester','crontab syntax builder','crontab minutes hours','cron backup scheduler','cron job tester','cron syntax generator','crontab scheduler online','free crontab generator','cron string builder','crontab script maker','developer server tools','cron job visualizer','crontab generator free'],
  contentBody:`## Crontab Generator – Simplify Linux Cron Job Scheduling

**Cron jobs** are standard server utilities in Linux/Unix systems used to run scripts, cleanups, or backups at specific intervals. However, the crontab syntax (\`* * * * *\`) is notoriously tricky. Our **Crontab Generator** lets you build correct, fully compliant cron schedules using simple dropdown selections.

### Understanding the 5 Cron Fields

A standard cron expression consists of 5 time fields:

\`\`\`
*     *     *     *     *
│     │     │     │     │
│     │     │     │     └───── Day of Week (0 - 6) (0 is Sunday)
│     │     │     └────────── Month (1 - 12)
│     │     └─────────────── Day of Month (1 - 31)
│     └──────────────────── Hour (0 - 23)
└───────────────────────── Minute (0 - 59)
\`\`\`

### Common Cron Expressions

- **Every Minute**: \`* * * * *\`
- **Every Hour**: \`0 * * * *\`
- **Every Day at Midnight**: \`0 0 * * *\`
- **Every Sunday at 3 AM**: \`0 3 * * 0\`
- **First of Every Month**: \`0 0 1 * *\`

### How to Use the Crontab Generator

1. Select your target intervals using the visual tabs (Minutes, Hours, Days, Weeks, Months).
2. Enter the absolute path to the script you want to run (e.g., \`/usr/bin/php /var/www/script.php\`).
3. Copy the compiled cron line directly.
4. Open your server terminal, type \`crontab -e\`, and paste your new schedule rule.`,
  faq:[
    {question:'Where do I paste the generated crontab line?',answer:'Access your Linux server terminal via SSH, run "crontab -e" to open the cron editor, and paste the generated line at the bottom of the file.'},
    {question:'What is the difference between crontab and Systemd timers?',answer:'Crontab is simple, standard, and highly compatible. Systemd timers offer more complex triggers and better logging but require deeper configuration.'},
    {question:'Does this generator support standard cron directories?',answer:'Yes. You can output standard crontab lines or export them into specialized hourly/daily files.'},
    {question:'Is this generator free?',answer:'Yes, completely free with no usage limits.'},
    {question:'What time zone do cron jobs run in?',answer:'Cron jobs execute in your server\'s local time zone. Always check your server system time zone before scheduling.'}
  ]
},
{
  toolSlug:'json-to-typescript',locale:'en',
  seoTitle:'JSON to TypeScript – Generate TypeScript Interfaces Free Online',
  seoDescription:'Instantly convert any JSON data or API response into clean, strongly typed TypeScript interfaces. Free developer productivity tool.',
  pageH1:'JSON to TypeScript Converter – Generate Interfaces Instantly',
  seoKeywords:['json to typescript','json to ts','json to typescript interface','json to ts compiler','typescript type generator','generate ts interface from json','typescript class generator','json interface builder','ts data typing tool','json schema to typescript','convert json to typescript online','free json to ts converter','developer typescript tools','strongly typed json','interface generator online','json type mapping','auto type generator','best json to typescript','json to ts tool free','typescript interface builder'],
  contentBody:`## JSON to TypeScript – Automatically Strongly Type Your API Responses

TypeScript makes frontend web development safer and more reliable by ensuring variables are strongly typed. However, manually mapping complex JSON payloads from external REST or GraphQL APIs into TypeScript interfaces is a tedious chore. Our **JSON to TypeScript** tool does this in one click.

### Why You Should Use TypeScript Interfaces

- **Compile-Time Safety**: Spot data bugs, typo errors, and missing parameters during compilation instead of runtime.
- **IDE Intellisense**: Get autocompletions in VS Code as you access nested API data objects.
- **Documentation**: Interfaces act as self-updating documentation describing exact data formats.
- **Fewer Crashes**: Prevents the classic \`Cannot read property of undefined\` crashes.

### Key Features of Our Converter

- **Deep Nesting Support**: Automatically generates separate interfaces for nested JSON objects.
- **Optional Parameter Mapping**: Detects null values or missing keys across arrays and marks those fields as optional (\`?\`).
- **Array Parsing**: Correctly type lists of uniform or mixed type entities.
- **Custom Naming**: Choose the base interface name (defaults to \`RootObject\`).

### How to Use the JSON to TS Converter

1. Paste your raw JSON data in the input panel.
2. Select your options (e.g., whether to use interfaces, types, or export wrappers).
3. The tool generates strongly typed TypeScript code instantly.
4. Copy the interfaces and paste them into your React, Nest.js, or Angular codebase.`,
  faq:[
    {question:'Does it generate interfaces or inline types?',answer:'You can toggle between generating standard interfaces (e.g., "interface User") or type definitions (e.g., "type User = ...") depending on your codebase standards.'},
    {question:'How does this tool handle mixed arrays?',answer:'It will attempt to create a union type (e.g., "string | number") or compile them into a unified, optional parameter interface.'},
    {question:'Is my private API payload secure?',answer:'Yes. All conversions happen entirely in your local browser sandbox.'},
    {question:'Does it support parsing JSON arrays directly?',answer:'Yes. If you paste a root array, the tool will analyze the items and generate the appropriate interfaces correctly.'},
    {question:'Is this JSON to TypeScript converter free?',answer:'Yes, 100% free with no registration.'}
  ]
},
];

const allData = [...data, ...data2, ...data3];

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
