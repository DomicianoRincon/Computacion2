# SPEC-02 · Lesson Markdown

## What It Is

Lessons are `.md` files written in **conventional Markdown** (CommonMark + GFM), parsed with `react-markdown` + `remark-gfm`. The handful of constructs with no standard Markdown equivalent (video embeds, DartPad, the Bean Visualizer, "try it live" tabs) are expressed as fenced code blocks with a special language or a meta string — every valid lesson file is still ordinary Markdown that any standard renderer/linter/editor preview understands.

The parser lives in `src/components/lesson/LessonParser.jsx` and returns `{ elements, subtitles, lessonTitle }`. A `unified`/`remark-parse` pre-pass over the parsed tree extracts `lessonTitle` (first `#`) and `subtitles` (`##` headings, in document order) synchronously, before `elements` is ever rendered — `LessonPage.jsx` needs both available immediately, not after mount.

---

## Standard Markdown Mapping

| Markdown | Renders as |
|---|---|
| `# Title` | `LessonTitle` (`h1`). First `#` in the file also sets `lessonTitle` (TOC header). |
| `## Subtitle` | `LessonSub` (`h4`) with a DOM `id` assigned in document order; appended to `subtitles` → Table of Contents. |
| `### Heading` | Plain bold `h5`-style `Typography`. Not added to the TOC (only `##` is). |
| Paragraph text | `LessonParagraph`. Blank line = new paragraph; a single newline inside one is a soft wrap, not a forced line break. |
| `` `code` `` | Inline `<code class="inline-code">`. |
| `**bold**`, `*italic*` | Native `<strong>`/`<em>` — not supported by the old DSL. |
| `[text](url)` | Styled `Link` component (accent color, launch icon, opens in a new tab). Works both inline in a sentence and as a link that's the only thing in its paragraph. |
| `![alt](src)` | `ImageBlock` (full-width, rounded corners, shadow). |
| `![alt](src "icon")` | `IconBlock` (no border-radius, larger vertical margin) — the literal `"icon"` title string is the signal, not a real HTML title tooltip. |
| `![alt](src "frameNN")` | `FramedImageBlock` — wraps the image in a padded white card scaled to `NN`% of the column width (e.g. `"frame60"` → 60%; bare `"frame"` → 100%). Intended for screenshots exported on a transparent background. Like `"icon"`, the title string is the signal. |
| `- item` / `1. item` | `<ul>`/`<ol>` with the custom 4px bar-marker bullet style. |
| ` ```lang ` … ` ``` ` | `CodeBlock` (PrismJS highlighting) for any language not special-cased below. |

`src` for images: a filename resolves against `src/assets/` (e.g. `image6.png`); an `http(s)://` URL is used as-is.

---

## Special Fenced-Block Languages

These fenced-code languages are intercepted before reaching `CodeBlock` and dispatch to a specific component instead. The fence body is the component's input verbatim (trailing newline stripped).

### ` ```mermaid `
Renders `MermaidBlock` — the fence body is the Mermaid diagram source.

### ` ```beansim `
Renders `BeanVisualizer` (see SPEC-07) — the fence body is Java annotations or XML bean definitions, passed as `initialCode`.

### ` ```svg `
Injects the fence body as raw SVG via `dangerouslySetInnerHTML`, wrapped in a scrollable container.

### ` ```dartpad `
Renders a standalone `DartPadEmbed`. The fence body (trimmed) is the Gist ID.
```
​```dartpad
abc123gistid
​```
```

### ` ```youtube `
Renders `YouTubeEmbed`. The fence body is `<videoId> | <title>`.
```
​```youtube
dQw4w9WgXcQ | Video de ejemplo
​```
```

### `trycode=<gistId>` fence meta (any other language)
Text after the language on the opening fence line is the fence's *meta string*; when it contains `trycode=<gistId>`, the block renders as a `TryCodeButton` — two tabs, **Código** (the static `CodeBlock`) and **Fire it up!** (a live `DartPadEmbed` for that Gist).
```
​```dart trycode=abc123
void main() { ... }
​```
```

---

## Adding a New Lesson

1. Create `content/lessonXX.md` **at the repo root** (sibling to `classnotesapp/`, not inside it — see `CLAUDE.md` → Content Pipeline) using standard Markdown plus the constructs above.
2. Add a `[lesson:url]` entry pointing at its raw GitHub URL to `toc.md` (repo root) — see the Table of Contents section below.
3. If the lesson uses local images, they must already exist in `classnotesapp/src/assets/` (referenced by filename only, no path) — image files themselves are bundled with the app, not fetched remotely.
4. Push to **both** git remotes (`origin` and `second`) — `second` is what `raw.githubusercontent.com` actually serves. See `CLAUDE.md` → Git Remotes.

---

## Table of Contents (`toc.md`)

`toc.md` lives at the **repo root** (not `src/content/`) and is fetched at runtime from a URL configured in `classnotesapp/src/content/config.js` (SPEC-10). It uses its own small tag language, parsed by `TableOfContentsParser` — unrelated to the lesson-body Markdown above and deliberately not converted, since it's already simple:

| Tag | Purpose |
|---|---|
| `[t] <label>` | Section heading in the sidebar (non-clickable) |
| `[d]` | Visual divider in the sidebar |
| `[lesson:url] <url>` or `[lesson:url] <url> \| <label>` | Lesson entry; `url` is fetched at runtime (SPEC-09), typically a `raw.githubusercontent.com` link into `content/`. Optional `\| <label>` overrides the sidebar text (defaults to the filename). |

- Lessons are numbered sequentially (1, 2, 3…) by order of appearance in `toc.md`.
- Lines beginning with `**` are ignored (used for commented-out entries).
- A bare `[lesson] <filename.md>` (no `:url`) is the old local-file form; the current parser logs a warning and ignores it — every real entry must be `[lesson:url]`.

---

## Parsing Notes

1. `extractHeadings` walks the parsed Markdown tree once (for `lessonTitle`/`subtitles`), independent of the `elements` render pass — both walk the same tree so heading order/ids line up, but this is two passes over the content, not one.
2. `p` (paragraph) and the list-item wrapper both render with `component="div"` on their `Typography`, not the MUI default `<p>` — real Markdown can nest block content (a standalone image, a "loose" list item's own paragraph) inside what was authored as a paragraph, which a real `<p>` tag cannot legally contain.
3. Fenced code blocks are assumed to always declare a language (` ```java `, never a bare ` ``` `) — the renderer distinguishes inline vs. block `code` by the presence of the `language-*` class, so an un-languaged fence would be misread as inline code.

---

## Adding a New Special Fenced-Block Language

1. Add a branch in the `code` component in `LessonParser.jsx` (`if (lang === "yourtag") return <YourComponent ... />`).
2. Create the React component in `src/components/lesson/` or the appropriate subfolder if it doesn't exist yet.
3. Document it in this file, in the "Special Fenced-Block Languages" section above.
