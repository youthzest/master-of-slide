---
name: slide
description: Use this skill when the user invokes `/slide <markdown-path>` or asks to turn a Markdown/Obsidian document into a Master Of Slide deck. It is the one-command deck creation workflow for Claude Code, Codex, and other coding agents.
---

# Slide

`/slide <markdown-path>` is the fast path for creating a Master Of Slide deck
from a local Markdown or Obsidian note.

This skill delegates the content workflow to `create-slide-from-markdown`, the
technical slide-writing rules to `slide-authoring`, and image prompt generation
to `create-slide-image-prompts`.

You only write files under `slides/<id>/`. Never modify the source Markdown note.

## Invocation

Preferred user form:

```text
/slide /absolute/path/to/source.md
```

Also accept:

```text
slide /absolute/path/to/source.md
Create slides from /absolute/path/to/source.md
```

If no Markdown path is present, ask for one. If the path is relative, resolve it
from the current workspace root.

## Workflow

1. Read the Markdown file.
2. Follow `create-slide-from-markdown`:
   - parse frontmatter, headings, callouts, wikilinks, embeds, image links
   - infer title, thesis, sections, audience, and key claims
   - pick a short kebab-case slide id
   - create `slides/<id>/index.tsx`
   - copy referenced local assets into `slides/<id>/assets/`
3. Follow `slide-authoring` for the React implementation:
   - 1920 x 1080 canvas discipline
   - one idea per page
   - top-level `export const design: DesignSystem = { ... }`
   - Korean-safe typography when the note is Korean
4. Use `create-slide-image-prompts` when the deck would benefit from images:
   - cover hero artwork
   - infographic / educational diagrams
   - product or brand posters
   - UI mockups
   - chapter artwork
5. If Codex or the current environment can generate bitmap images, generate the
   selected assets and save them under `slides/<id>/assets/`. Otherwise, add
   `ImagePlaceholder` components with precise hints and include final prompts in
   the handoff.
6. Self-review:
   - all imported assets exist
   - no text overflows at 1920 x 1080
   - Korean copy uses readable line heights and safe wrapping
   - exported default array contains all pages
   - deck opens in the Web UI

## Image Guidance

Do not generate images for every page by default. Pick the few images that make
the deck better:

- one cover or hero image
- one diagram or infographic if the document explains a process
- one product / UI / brand visual if the document is commercial or product-led

Keep important Korean text as React text, not baked into generated images, so it
stays editable and exports more reliably.

## Output

Tell the user:

- source Markdown path
- created slide id
- created file path
- page count
- assets copied, generated, or left as placeholders
- preview URL: `http://127.0.0.1:5173/s/<id>`

If the dev server is not running, tell them to run:

```bash
pnpm dev
```
