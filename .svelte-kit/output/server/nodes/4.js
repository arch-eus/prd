import * as universal from '../entries/pages/logbook/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logbook/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/logbook/+page.ts";
export const imports = ["_app/immutable/nodes/4.NmZyKQgN.js","_app/immutable/chunks/scheduler.DrDOSCrp.js","_app/immutable/chunks/index.BljkXhbZ.js","_app/immutable/chunks/index.D0tE5qX2.js","_app/immutable/chunks/Icon.C5GaHf5i.js","_app/immutable/chunks/tag.COAFjn-V.js","_app/immutable/chunks/format.DS6QGfyw.js","_app/immutable/chunks/download.BFTxnY3b.js"];
export const stylesheets = [];
export const fonts = [];
