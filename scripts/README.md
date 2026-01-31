# SEO Optimization Scripts

## Overview
These scripts automatically generate and apply high-quality SEO optimizations to all tools across all languages.

## Files

### 1. `seo-optimizer.js`
Generates SEO content for all tools based on:
- Tool category patterns
- Tool-specific SEO data
- Best practices (60-char titles, 160-char descriptions, long-tail keywords)

### 2. `apply-seo.js`
Applies generated SEO content to:
- `lib/seo.ts` - Main SEO configuration
- `messages/*.json` - All 14 language files

## Usage

### Step 1: Generate SEO Content
```bash
node scripts/seo-optimizer.js
```

This will:
- Read all tools from `lib/tools.ts`
- Generate optimized SEO content
- Save to `seo-output.json` for review

### Step 2: Review Generated Content
```bash
cat seo-output.json
```

Review the generated SEO content and make any necessary adjustments.

### Step 3: Apply SEO Content
```bash
node scripts/apply-seo.js
```

This will:
- Update `lib/seo.ts` with optimized titles, descriptions, keywords, H1
- Update all 14 language files (`messages/*.json`) with localized SEO content

### Step 4: Build and Test
```bash
npm run build
```

## SEO Patterns

### Title Template
- **Image Tools**: `Free {name} Online - {action} No Signup`
- **PDF Tools**: `{name} Free - Convert Online No Signup`
- **Text Tools**: `{name} Free Online - {action}`
- **Converter Tools**: `{name} Free - Convert Online No Signup`
- **Security Tools**: `{name} Free - {action}`
- **Calculator Tools**: `{name} Free Online - Calculate {metric}`
- **Utility Tools**: `{name} Free - Generate {type}`
- **Developer Tools**: `{name} Free - {action} Code`
- **YouTube Tools**: `{name} Free - {action}`
- **SEO Tools**: `{name} Free - {action}`
- **Social Tools**: `{name} Free - {action}`

### Description Template
- Includes: Action, Benefits, No login, Fast, Secure, Use case
- Format: `{action} online free. {benefits}. No login, fast, secure. Perfect for {useCase}.`

### Keywords
- Long-tail variations
- Low competition keywords
- Tool-specific keywords
- Category keywords

## Supported Languages

1. English (en)
2. Hindi (hi)
3. Spanish (es)
4. French (fr)
5. German (de)
6. Arabic (ar)
7. Portuguese (pt)
8. Russian (ru)
9. Indonesian (id)
10. Italian (it)
11. Japanese (ja)
12. Korean (ko)
13. Turkish (tr)
14. Chinese (zh)

## Customization

### Add New Tool SEO Data
Edit `TOOL_SEO_DATA` in `seo-optimizer.js`:

```javascript
'new-tool-slug': {
    action: 'Action description',
    benefits: 'Key benefits',
    useCase: 'Primary use case',
    keywords: 'keyword1, keyword2, keyword3'
}
```

### Add New Language
1. Add translations to `LANGUAGE_TRANSLATIONS` in `seo-optimizer.js`
2. Add language code to `LANGUAGES` array in `apply-seo.js`
3. Ensure `messages/{lang}.json` exists

## Best Practices

1. **Titles**: Keep under 60 characters, include primary keyword
2. **Descriptions**: Keep under 160 characters, include CTA
3. **Keywords**: Use long-tail, low-competition variations
4. **H1**: Match title but can be slightly longer
5. **Content**: 700+ words with proper H2/H3 structure
6. **FAQs**: 3-5 questions with detailed answers

## Notes

- Scripts use simplified parsing - may need adjustments for complex cases
- Translation is basic - consider using translation API for production
- Always review generated content before applying
- Test build after applying changes

