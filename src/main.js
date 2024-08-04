// @ts-check
import { AsyncLocalStorage } from "node:async_hooks";

// @ts-ignore: Property 'UrlPattern' does not exist
if (!globalThis.URLPattern) {
	await import("urlpattern-polyfill");
}

/** @template {Record<string, unknown>} L */
export class RequestContext {
	/** @type {L} */
	#locals;
	#res;
	/** @param {Request} req */
	constructor(req) {
		this.req = req;
		this.headers = req.headers;
		this.url = new URL(req.url);
		/** @type {Record<string, string | undefined>} */
		this.params = {};
		this.#locals = /** @type {L} */ ({});
		this.#res = {
			status: 200,
			headers: new Headers(),
		};
	}
	/** @param {number} s */
	status(s) {
		this.#res.status = s;
		return this;
	}
	/**
	 * @param {string} k
	 * @param {string} v
	 */
	header(k, v) {
		this.#res.headers.append(k, v);
		return this;
	}
	/**
	 * @param {string} to
	 * @param {number=} status
	 */
	redirect(to, status = 303) {
		this.#res.status = status;
		this.#res.headers.set("location", to);
		return new Response("", this.#res);
	}
	/** @param {string} body */
	html(body) {
		this.#res.headers.set("content-type", "text/html; charset=utf-8");
		return new Response("<!doctype html>" + body, this.#res);
	}
	/**
	 * @typedef {keyof L} Key
	 * @param {Key} key
	 * @return {L[Key]}
	 */
	get(key) {
		let val = this.#locals[key];
		if (!val) throw new Error(`No locals value found for key '${String(key)}`);
		return val;
	}
	/**
	 * @param {Key} key
	 * @param {L[Key]} value
	 */
	set(key, value) {
		this.#locals[key] = value;
		return this;
	}
}

/** @template {Record<string, unknown>} L */
export function router() {
	/** @type {AsyncLocalStorage<RequestContext<L>>} */
	const storage = new AsyncLocalStorage();
	/**
	 * @template T
	 * @typedef {Promise<T> | T} Async
	 */
	/**
	 * @typedef {"all" | "get" | "post"} Method
	 * @typedef {(c: RequestContext<L>) => Async<Response | string | void>} Handler
	 * @typedef {Array<[Method, URLPattern, Array<Handler>]>} Routes
	 */
	/** @type {Routes} */
	let routes = [];
	return {
		/** @param {string} pathname */
		route(pathname) {
			let p = new URLPattern({ pathname });
			return {
				/** @param {...Handler} hs */
				all(...hs) {
					routes.push(["all", p, hs]);
					return this;
				},
				/** @param {...Handler} hs */
				get(...hs) {
					routes.push(["get", p, hs]);
					return this;
				},
				/** @param {...Handler} hs */
				post(...hs) {
					routes.push(["post", p, hs]);
					return this;
				},
			};
		},
		/**
		 * @param {Request} req
		 * @return {Promise<Response>}
		 */
		async fetch(req) {
			let method = req.method.toLowerCase();
			if (method !== "get" && method !== "post")
				return new Response("Not found", { status: 404 });
			let url = new URL(req.url);
			/** @type {RequestContext<L>} */
			let context = new RequestContext(req);

			for (let [m, p, hs] of routes) {
				if (m !== method && m !== "all") continue;
				let match = p.exec(url);
				if (!match) continue;
				context.params = match.pathname.groups;
				for (let h of hs) {
					let res = await storage.run(context, () => h(context));
					if (res instanceof Response) return res;
					if (typeof res === "string") return context.html(res);
				}
			}
			return context.status(404).html("<h1>Not found</h1>");
		},
		context() {
			let c = storage.getStore();
			if (!c) {
				throw new Error("context() must be called within a request handler");
			}
			return c;
		},
	};
}
