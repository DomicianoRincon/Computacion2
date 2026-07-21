# Spec Status

Last updated: 2026-07-21

| Spec | Title | Status | Notes |
|---|---|---|---|
| SPEC-01 | Project Overview | ✅ Docs only | No code needed |
| SPEC-02 | Lesson Markdown | ✅ Implemented | Migrated from the old bracket-tag DSL to conventional Markdown (`react-markdown`/`remark-gfm`); all 84 lessons converted |
| SPEC-03 | Layout & Responsive | ✅ Implemented | See bugs L1, L2 below |
| SPEC-04 | Design System | ✅ Implemented | |
| SPEC-05 | Components | ✅ Implemented | See bugs P1–P5 below |
| SPEC-06 | Content Management | ✅ Implemented | |
| SPEC-07 | BeanVisualizer | ✅ Implemented | |
| SPEC-08 | Known Issues | 🔧 In progress | See per-issue status below |
| SPEC-09 | Remote Lessons (`[lesson:url]`) | ✅ Implemented | |
| SPEC-10 | Remote toc.md via config.js | ✅ Implemented | |
| SPEC-11 | Lazy Lesson Loading | ✅ Implemented | `LessonContentCache` context; parser now synchronous; inline labels supported |

## SPEC-08 Bug Tracker

| ID | Description | Status |
|---|---|---|
| P1 | LessonParagraph unreachable | ✅ Fixed — moot after the SPEC-02 Markdown migration (paragraphs render through it now); also fixed an invalid `<p>`-nesting bug found along the way (`component="div"` on `LessonParagraph`/list items) |
| P2 | IconBlock / ImageBlock identical render | ⏸ Deferred — minor cosmetic |
| P3 | `[d]` divider renders nothing in drawer | ✅ Fixed |
| P4 | TOC check-circle button non-functional | ✅ Fixed |
| P5 | YouTubeEmbed wrong aspect ratio (66.25% → 56.25%) | ✅ Fixed |
| L1 | Hardcoded left/right in LessonPage | ✅ Fixed — named constants |
| L2 | AppBar uses `md` breakpoint, drawer uses `lg` | ✅ Fixed |
| G1 | No search | ⏸ Deferred |
| G2 | No progress percentage | ⏸ Deferred |
| G3 | TryCodeButton is DartPad-only | ⏸ Deferred |
| G4 | Lesson IDs are positional | ⏸ Deferred |
| G5 | Theme mode not persisted | ⏸ Deferred |

## Test Coverage

| Module | Test file | Status |
|---|---|---|
| `markdownUtils.js` | `src/utils/markdownUtils.test.js` | ✅ |
| `tableOfContentsParser.js` | `src/utils/tableOfContentsParser.test.js` | ✅ |
| `LessonParser.jsx` | `src/components/lesson/LessonParser.test.jsx` | ✅ |
| `buildBeanGraph.js` | `src/components/BeanVisualizer/model/buildBeanGraph.test.js` | ✅ |
| `beanDetection.js` | `src/components/BeanVisualizer/regex/beanDetection.test.js` | ✅ |
| `cycleDetection.js` | `src/components/BeanVisualizer/regex/cycleDetection.test.js` | ✅ |
| `StudiedLessonsContext` | `src/theme/StudiedLessonsContext.test.jsx` | ✅ |
| `ThemeContext` | `src/theme/ThemeContext.test.jsx` | ✅ |
