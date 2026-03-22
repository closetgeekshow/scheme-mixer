// js/config.js
// Fetches all three config files and exports them as module-level constants.
// Top-level await means all downstream importers (state, ui, main) wait
// automatically — no changes needed in any other module.

const [APP_CONFIG, DESIGN_CONFIG, LIBRARY] = await Promise.all([
  fetch('./data/app.config.json').then(r => {
    if (!r.ok) throw new Error(`Failed to load app.config.json: ${r.status}`);
    return r.json();
  }),
  fetch('./data/design.config.json').then(r => {
    if (!r.ok) throw new Error(`Failed to load design.config.json: ${r.status}`);
    return r.json();
  }),
  fetch('./data/library.json').then(r => {
    if (!r.ok) throw new Error(`Failed to load library.json: ${r.status}`);
    return r.json();
  }),
]);

export { APP_CONFIG, DESIGN_CONFIG, LIBRARY };