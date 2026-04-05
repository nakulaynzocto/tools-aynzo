# Scripts Directory

These are the **active, production-relevant** scripts for the Aynzo Tools platform.

---

## Active Scripts

### 1. `post-build.js` ⚙️ (Auto-runs after every build)
**Triggered automatically by:** `npm run build` → `postbuild` hook

Runs post-processing steps after the Next.js production build completes. Do not remove.

---

### 2. `translate-blog-content.js` 🌍 (Run when adding new blogs)
**Triggered by:** `npm run translate-blog`

Translates new blog posts in `seo-blogs/` into all 14 supported languages.

**When to use:** After adding a new English blog JSON file to `seo-blogs/`.
```bash
npm run translate-blog
```

---

### 3. `generate-seo-blogs.js` ✍️ (Run to generate new SEO blogs)
Generates SEO-optimized blog post JSON files for `seo-blogs/`.

**When to use:** When you want to create new blog content for the platform.
```bash
node scripts/generate-seo-blogs.js
```

---

### 4. `generate-calc-blogs.js` 🧮 (Run to generate calculator blogs)
Generates specialized blog content for calculator tools.

**When to use:** When adding new calculator-focused blog posts.
```bash
node scripts/generate-calc-blogs.js
```

---

## Supported Languages (14 total)

| Code | Language |
|------|----------|
| `en` | English |
| `hi` | Hindi |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `ar` | Arabic |
| `pt` | Portuguese |
| `ru` | Russian |
| `id` | Indonesian |
| `it` | Italian |
| `ja` | Japanese |
| `ko` | Korean |
| `tr` | Turkish |
| `zh` | Chinese |

---

## Notes
- **Never remove** `post-build.js` — it's part of the build pipeline.
- Content changes to `lib/seo.ts` do NOT require re-running any script; they're picked up at build time.
- All 14 locale JSON files in `messages/` are the source of truth for translations.
