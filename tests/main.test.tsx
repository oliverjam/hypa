import { expect, test, describe } from "bun:test";
import { router } from "../src/main.js";

describe("routing", () => {
	let app = router();

	test("simple GET", async () => {
		app.route("/").get(() => <h1>Hello</h1>);
		let res = await app.fetch(get("/"));
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/html; utf-8");
		let body = await res.text();
		expect(body).toBe("<!doctype html><h1>Hello</h1>");
	});

	test("simple POST", async () => {
		app.route("/").post((c) => c.redirect("/foo"));
		let res = await app.fetch(post("/"));
		expect(res.status).toBe(303);
		expect(res.headers.get("location")).toBe("/foo");
	});

	test("params GET", async () => {
		app.route("/thing/:id").get((c) => <h1>Hello {c.params.id}</h1>);
		let res = await app.fetch(get("/thing/2"));
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/html; utf-8");
		let body = await res.text();
		expect(body).toBe("<!doctype html><h1>Hello 2</h1>");
	});

	test("params POST with body", async () => {
		app.route("/thing/:id").post((c) => c.redirect("/" + c.params.id));
		let res = await app.fetch(post("/thing/2"));
		expect(res.status).toBe(303);
		expect(res.headers.get("location")).toBe("/2");
	});

	test("catch-all with status", async () => {
		app.route("*").get((c) => c.status(404).html(<h1>Not found</h1>));
		let res = await app.fetch(get("/xyz"));
		expect(res.status).toBe(404);
		expect(res.headers.get("content-type")).toBe("text/html; utf-8");
		let body = await res.text();
		expect(body).toBe("<!doctype html><h1>Not found</h1>");
	});
});

function get(path: string, init?: RequestInit) {
	return new Request(`http://localhost${path}`, init);
}

function post(path: string, init?: RequestInit) {
	return new Request(`http://localhost${path}`, {
		...init,
		method: "POST",
		headers: {
			...init?.headers,
			"content-type": "application/x-www-form-urlencoded",
		},
		redirect: "manual",
	});
}
