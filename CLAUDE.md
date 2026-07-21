# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a course repository for **Computación en Red 2 (Compunet2)**. It contains:
- `classnotesapp/` — A React + Vite SPA that renders the course notes as a navigable lesson viewer
- `Notas de clase/` — Raw markdown notes organized by session (S01–S32)
- `Images/` — Images referenced in notes

## classnotesapp Commands

All commands run from `classnotesapp/`:

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
npm run test      # Vitest (run all tests)
npx vitest run <file>  # Run a single test file
```

## Git Remotes

This repo has **two** remotes pointing at two different GitHub repos, both tracking the same `main` branch/history:

- `origin` → `https://github.com/Domiciano/Compunet2-252`
- `second` → `https://github.com/DomicianoRincon/Computacion2`

They matter because `classnotesapp/src/content/config.js` fetches lesson content at runtime from `raw.githubusercontent.com/DomicianoRincon/Computacion2/...` — i.e. from **`second`**, not `origin`. Pushing only to `origin` does NOT update what the running app fetches; `second` must also be pushed for content or app changes to actually take effect live.

`origin` already has cached push credentials (works with a plain `git push origin main`). `second` needs a Personal Access Token passed explicitly — it is **not** stored anywhere in this repo. It lives as the `$PAT_GITHUB_DOMICIANO_RINCON` environment variable in the local shell profile (`~/.zshrc`, not synced/committed anywhere). To push to `second`:

```bash
git push "https://domicianorincon:$PAT_GITHUB_DOMICIANO_RINCON@github.com/domicianorincon/Computacion2" main
```

Never write the literal token value into this file, any commit, or any other file that gets pushed — reference it only via the `$PAT_GITHUB_DOMICIANO_RINCON` env var.

## Architecture

### Content Pipeline

Lessons are authored in **conventional Markdown** (CommonMark + GFM), parsed with `react-markdown` + `remark-gfm` by `LessonParser.jsx`. A handful of constructs with no standard Markdown equivalent (video embeds, DartPad, the Bean Visualizer, "try it live" tabs) are expressed as fenced code blocks with a special language or meta string — see `specs/02-dsl.md` for the full mapping. (Before 2026-07, lessons used a proprietary bracket-tag DSL; that was migrated away from lesson-by-lesson, see `specs/02-dsl.md` for what changed.)

Lesson content itself is **not** inside `classnotesapp/` — it lives at the **repo root**, sibling to `classnotesapp/`: `./toc.md` and `./content/*.md`. It's fetched by the running app at runtime from GitHub raw URLs (SPEC-09/10/11), not bundled at build time — `classnotesapp/src/content/` only holds `config.js`.

**Flow:**
1. `classnotesapp/src/content/config.js` points `tocUrl` at a raw `toc.md` URL (currently `raw.githubusercontent.com/DomicianoRincon/Computacion2/...` — see "Git Remotes" below for why that specific remote)
2. `App.jsx` fetches that URL at runtime; `TableOfContentsParser` (`src/utils/tableOfContentsParser.js`) parses it into a `sections` array — entries are `[t]` (title), `[d]` (divider), `[lesson:url] <url>` (lesson, fetched on demand)
3. `LessonPage.jsx` resolves the section by route ID and fetches its Markdown (via `LessonContentCache`)
4. `LessonParser.jsx` converts the Markdown into React components, returning `{ elements, subtitles, lessonTitle }`

See `specs/02-dsl.md` for the full Markdown → component mapping (headings, images, links, code fences, and the special fenced-block languages like `mermaid`/`beansim`/`dartpad`/`youtube`/`trycode=`).

### Adding a New Lesson

1. Create `content/lessonXX.md` **at the repo root** (not inside `classnotesapp/`) using standard Markdown — see `specs/02-dsl.md`
2. Add a `[lesson:url] <raw-url>` entry to `toc.md` (repo root)
3. If the lesson uses local images, they must exist in `classnotesapp/src/assets/` and are referenced by filename only (no path) — image files are bundled with the app, not fetched remotely
4. Push to **both** git remotes — see "Git Remotes" above; `raw.githubusercontent.com` only reflects `second`

### BeanVisualizer

Located in `src/components/BeanVisualizer/`. It is an interactive canvas tool that parses Java Spring bean annotations or XML bean definitions and renders a dependency graph. It uses `src/components/BeanVisualizer/regex/` modules for detection and `src/components/BeanVisualizer/model/buildBeanGraph.js` to produce the graph model.

### Routing

Routes are `/{base}/lesson/:lessonId` where `lessonId` is a sequential integer assigned by `TableOfContentsParser`. The app is deployed at base path `/compu2/` (configured in `vite.config.js`). Deep-link support for GitHub Pages is handled via `public/404.html` and a `?p=` query parameter redirect in `App.jsx`.

### Theme

`ThemeContext.jsx` provides a dark/light theme toggle. Custom color tokens are in `src/theme/colors.js`. The default mode is `dark`.

### Path Alias

`@/` maps to `src/` (configured in `vite.config.js`).
