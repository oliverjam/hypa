import { RequestContext, router } from "router";
import { Public } from "./routes/public.ts";
import { Profile } from "./routes/profile.tsx";
import { Book, BookDesk } from "./routes/book.tsx";

type Locals = { user: { name: string } };
export type Context = RequestContext<Locals>;

let app = router<Locals>();

export let context = app.context;

app.route("*").all(({ url, req }) => {
	let t = new Date().toLocaleTimeString("en-GB");
	console.log(`${t} ${req.method} ${url}`);
});

app.route("*").all((c) => {
	c.set("user", { name: "oli" });
});

app.route("/public/*").get(Public);
app.route("/").get(Profile);
app.route("/book").get(Book);
app.route("/book/:desk_id").get(BookDesk);

app.route("*").get((c) => c.status(404).html(<h1>Not found</h1>));

let server = Bun.serve(app);

console.log(`http://localhost:${server.port}`);
