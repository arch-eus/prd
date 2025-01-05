export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.DtoHsucc.js","app":"_app/immutable/entry/app.BZxDCKrZ.js","imports":["_app/immutable/entry/start.DtoHsucc.js","_app/immutable/chunks/entry.Q5SuwGPT.js","_app/immutable/chunks/scheduler.DrDOSCrp.js","_app/immutable/chunks/index.D0tE5qX2.js","_app/immutable/entry/app.BZxDCKrZ.js","_app/immutable/chunks/scheduler.DrDOSCrp.js","_app/immutable/chunks/index.BljkXhbZ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/completed",
				pattern: /^\/completed\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/logbook",
				pattern: /^\/logbook\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/recurring",
				pattern: /^\/recurring\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
