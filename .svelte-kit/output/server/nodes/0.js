import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.81qIw6wU.js","_app/immutable/chunks/scheduler.DrDOSCrp.js","_app/immutable/chunks/index.BljkXhbZ.js","_app/immutable/chunks/Icon.C5GaHf5i.js","_app/immutable/chunks/index.D0tE5qX2.js","_app/immutable/chunks/tag.COAFjn-V.js","_app/immutable/chunks/TaskFormModal.CUYTaMxC.js","_app/immutable/chunks/stores.BsB0SR2j.js","_app/immutable/chunks/entry.Q5SuwGPT.js","_app/immutable/chunks/index.CSbLPxVj.js"];
export const stylesheets = ["_app/immutable/assets/0.Ck9NQk9A.css"];
export const fonts = [];
