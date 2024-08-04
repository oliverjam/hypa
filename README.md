# hypa

A minimal TypeScript server framework for building simple apps. Designed for modern runtimes like [Bun](https://bun.sh/).

## Getting started

Install in your project:

```sh
npm install @oliverjam/hypa
```

Configure JSX via `tsconfig.json`:

```json
{
	"jsx": "react-jsx",
	"jsxImportSource": "@oliverjam/hypa"
}
```

Create a server:

```tsx
import { router } from "router";

let app = router();

app.route("/").get(() => <h1>Hello world</h1>);
app.route("*").get((c) => c.status(404).html(<h1>Not found</h1>));

let server = Bun.serve(app);

console.log(`Listening on http://localhost:${server.port}`);
```
