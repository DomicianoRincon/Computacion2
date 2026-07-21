// src/content/config.js
// SPEC-10: Single build-time artifact that points the app at its content source.
// Change tocUrl to point at a different branch or repo without rebuilding the app.
// Set tocUrl to '' to use the local src/content/toc.md (development / offline mode).

const courseConfig = {
  // TEMP — testing the Markdown migration locally before pushing. Points at
  // public/local-content/ (the real toc.md + converted content, copied from
  // repo root). Revert to the raw.githubusercontent.com URL before shipping.
  tocUrl: `${import.meta.env.BASE_URL}local-content/toc.md`,
};

export default courseConfig;
