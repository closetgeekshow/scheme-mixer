// js/config.js
// Parse inline JSON config blocks and export typed constants.

const APP_CONFIG = JSON.parse(document.getElementById('cfg-app').textContent);
const DESIGN_CONFIG = JSON.parse(document.getElementById('cfg-design').textContent);
const LIBRARY = JSON.parse(document.getElementById('cfg-library').textContent);

export { APP_CONFIG, DESIGN_CONFIG, LIBRARY };