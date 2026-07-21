// src/content/config.js
// SPEC-10: Single build-time artifact that points the app at its content source.
// Change tocUrl to point at a different branch or repo without rebuilding the app.
// Set tocUrl to '' to use the local src/content/toc.md (development / offline mode).

const courseConfig = {
  tocUrl: 'https://raw.githubusercontent.com/DomicianoRincon/Computacion2/refs/heads/main/toc.md',
};

export default courseConfig;
