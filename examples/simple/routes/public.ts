import { type Context } from "../main.tsx";

let ONE_YEAR = 60 * 60 * 24 * 365;

export async function Public(c: Context) {
	let file = Bun.file("." + c.url.pathname);
	if (await file.exists()) {
		return new Response(file, {
			headers: { "cache-control": `max-age=${ONE_YEAR}, immutable` },
		});
	}
}
