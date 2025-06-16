# @4hse/astro-llms-txt

An Astro integration to generate AI‑friendly documentation files:

- **`/llms.txt`** – primary index with title, description, and structured links  
- **`/llms-small.txt`** – ultra‑compact version containing only page structure (titles, lists)  
- **`/llms-full.txt`** – full Markdown documentation in a single file  

---

## Installation

```bash
npm install @4hse/astro-llms-txt
# or
yarn add @4hse/astro-llms-txt
```

## Usage

```javascript
import { defineConfig } from 'astro/config';
import astroLlmsTxt from '@4hse/astro-llms-txt';

export default defineConfig({
  site: 'https://www.4hse.com',
  integrations: [
    astroLlmsTxt({
      title: '4HSE',
      description: '4HSE is cloud‑based HSE software that automates workplace safety processes…',
      details: 'Additional context or guidelines.',
      notes: '- This content is auto‑generated from the official source.',
      optionalLinks: [
        {
          label: 'News',
          url: 'https://www.4hse.com/en/news',
          description: 'Latest company news',
        },
      ],
      docSet: [
        {
          title: 'Complete site',
          description: 'The full site of 4HSE',
          url: '/llms-full.txt',
          include: ['en/', 'en/**'],
          promote: ['en/'],
        },
        {
          title: 'Small site',
          description: 'Index of key pages',
          url: '/llms-small.txt',
          include: ['en/', 'en/**'],
          onlyStructure: true,
          promote: ['en/'],
        },
      ],
      pageSeparator: '\n\n---\n\n',
    }),
  ],
});
```

- `onlyStructure`: true makes `llms-small.txt` include only headings and list structure.

- Use `promote`/`demote` with glob patterns for ordering pages.

- Customize `mainSelector` or `ignoreSelectors` when scraping non-standard HTML.

## Difference: small vs. full

- `llms-small.txt`: extremely concise—keeps only hierarchy (titles, lists), ideal for agents with limited token budget.

- `llms-full.txt`: exports entire documentation in a single file with full Markdown—suitable for RAG flows, IDEs, or tools that ingest content once.

## Configuration summary

### llms.txt config

| Property        | Type                             | Description                      |
| --------------- | -------------------------------- | -------------------------------- |
| `title`         | `string`                         | Root H1 header                   |
| `description`   | `string?`                        | Blockquote under title           |
| `details`       | `string?`                        | Expanded guidance paragraphs     |
| `notes`         | `string?`                        | Footer note                      |
| `optionalLinks` | `{ label, url, description }[]?` | Non-essential references         |
| `docSet`        | `DocSet[]?`                      | Sets of documentation files      |
| `pageSeparator` | `string?`                        | Custom separator between entries |

### Single DocSet config

| Property          | Type        | Description                             |
| ----------------- | ----------- | --------------------------------------- |
| `title`           | `string`    | Section title                           |
| `description`     | `string`    | Blockquote in each file                 |
| `url`             | `string`    | Output file URL (e.g. `/llms-full.txt`) |
| `include`         | `string[]`  | Glob patterns for pages                 |
| `promote`         | `string[]?` | Globs to push pages higher              |
| `demote`          | `string[]?` | Globs to push pages lower               |
| `onlyStructure`   | `boolean?`  | If true, extracts headings + lists only |
| `mainSelector`    | `string?`   | CSS selector for main HTML root         |
| `ignoreSelectors` | `string[]?` | CSS selectors to skip in HTMl to MD     |
