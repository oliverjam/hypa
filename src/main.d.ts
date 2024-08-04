export declare class RequestContext<Locals extends Record<string, unknown>> {
	req: Request;
	headers: Headers;
	url: URL;
	params: Record<string, string | undefined>;
	#locals: Locals;
	#res: { status: number; headers: Headers };
	constructor(req: Request);
	status(s: number): this;
	header(k: string, v: string): this;
	redirect(to: string, status?: number): Response;
	html(body: string): Response;
	get(key: keyof Locals): Locals[typeof key];
	set(key: keyof Locals, value: Locals[typeof key]): this;
}

type Locals = Record<string, unknown>;
type Async<T> = Promise<T> | T;
type Method = "all" | "get" | "post";
type Handler<L extends Locals> = (
	c: RequestContext<L>
) => Async<Response | string | void>;

declare class Route<L extends Locals> {
	all(...hs: Array<Handler<L>>): this;
	get(...hs: Array<Handler<L>>): this;
	post(...hs: Array<Handler<L>>): this;
}

export declare function router<L extends Locals>(): {
	route(path: string): Route<L>;
	fetch(req: Request): Promise<Response>;
	context(): RequestContext<Locals>;
};
