import { expect, test, describe } from "bun:test";

describe("jsx children", () => {
	test("string", () => {
		let html = <h1>hello</h1>;
		expect(html).toBe(`<h1>hello</h1>`);
	});
	test("string", () => {
		let html = <h1>hello</h1>;
		expect(html).toBe(`<h1>hello</h1>`);
	});
	test("void", () => {
		let html = <input />;
		expect(html).toBe(`<input>`);
	});
	test("number", () => {
		let html = <h1>{999}</h1>;
		expect(html).toBe(`<h1>999</h1>`);
	});
	test("undefined", () => {
		let html = <h1>{undefined}</h1>;
		expect(html).toBe(`<h1></h1>`);
	});
	test("null", () => {
		let html = <h1>{null}</h1>;
		expect(html).toBe(`<h1></h1>`);
	});
	test("zero`", () => {
		let html = <h1>{0}</h1>;
		expect(html).toBe(`<h1>0</h1>`);
	});
	test("false", () => {
		let html = <h1>{false}</h1>;
		expect(html).toBe(`<h1></h1>`);
	});
});

describe("jsx attributes", () => {
	test("string", () => {
		let html = <h1 id="foo">hello</h1>;
		expect(html).toBe(`<h1 id="foo">hello</h1>`);
	});
	test("multiple strings", () => {
		let html = (
			<h1 id="foo" class="bar qux">
				hello
			</h1>
		);
		expect(html).toBe(`<h1 id="foo" class="bar qux">hello</h1>`);
	});
	test("number", () => {
		let html = <h1 tabindex={0}>hello</h1>;
		expect(html).toBe(`<h1 tabindex="0">hello</h1>`);
	});
	test("undefined", () => {
		let html = <h1 class={undefined}>hello</h1>;
		expect(html).toBe(`<h1>hello</h1>`);
	});
	test("null", () => {
		// @ts-expect-error
		let html = <h1 class={null}>hello</h1>;
		expect(html).toBe(`<h1>hello</h1>`);
	});
	test("false", () => {
		let html = <h1 hidden={false}>hello</h1>;
		expect(html).toBe(`<h1>hello</h1>`);
	});
	test("boolean", () => {
		let html = <h1 hidden={true}>hello</h1>;
		expect(html).toBe(`<h1 hidden>hello</h1>`);
	});
	test("empty string boolean", () => {
		let html = <h1 hidden="">hello</h1>;
		expect(html).toBe(`<h1 hidden="">hello</h1>`);
	});
	test("multiple booleans", () => {
		let html = (
			<h1 hidden={true} class="foo" draggable>
				hello
			</h1>
		);
		expect(html).toBe(`<h1 hidden class="foo" draggable>hello</h1>`);
	});
});

describe("jsxs children", () => {
	test("multiple element children", () => {
		let html = (
			<h1>
				<b>hello</b> <b>world</b>
			</h1>
		);
		expect(html).toBe(`<h1><b>hello</b> <b>world</b></h1>`);
	});
	test("multiple falsy children", () => {
		let html = (
			<h1>
				{false}
				<b>hello</b> {undefined}
				{0} {"world"}
			</h1>
		);
		expect(html).toBe(`<h1><b>hello</b> 0 world</h1>`);
	});
});

test("fragments", () => {
	let html = (
		<>
			<p>hello</p>
			<p>world</p>
		</>
	);
	expect(html).toBe(`<p>hello</p><p>world</p>`);
});

describe("jsx components", () => {
	test("component", () => {
		let Foo = () => <h1>hello</h1>;
		let html = (
			<div>
				<Foo />
			</div>
		);
		expect(html).toBe(`<div><h1>hello</h1></div>`);
	});
	test("component returns null", () => {
		let Foo = () => null;
		let html = (
			<div>
				<Foo />
			</div>
		);
		expect(html).toBe(`<div></div>`);
	});
	test("component with multiple children", () => {
		let Foo = (props: JSX.Props) => <h1>{props.children}</h1>;
		let html = (
			<div>
				<Foo>
					<b>hello</b> <b>world</b>
				</Foo>
			</div>
		);
		expect(html).toBe(`<div><h1><b>hello</b> <b>world</b></h1></div>`);
	});
});
