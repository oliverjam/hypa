const VOIDS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"source",
	"track",
	"wbr",
]);

/**
 * @param {string | (props: JSX.Props) => JSX.Children} tag
 * @param {JSX.Props} props
 * @return {string}
 */
function jsx(tag, props) {
	if (typeof tag === "function") return stringify(tag(props));
	let { children, ...rest } = props;
	let attrs = "";
	for (let [k, v] of Object.entries(rest)) {
		if (v === true) attrs += ` ${k}`;
		else if (v !== false && v != null) attrs += ` ${k}="${v}"`;
	}
	if (VOIDS.has(tag)) return `<${tag}${attrs}>`;
	return `<${tag}${attrs}>${stringify(children)}</${tag}>`;
}

/**
 * @param {JSX.Children} children
 * @return {string}
 */
function stringify(children) {
	if (Array.isArray(children)) return children.map(stringify).join("");
	if (children == null || children === false) return "";
	return String(children);
}

/** @param {JSX.Props} props */
function Fragment(props) {
	return stringify(props.children);
}

export { jsx, jsx as jsxDEV, jsx as jsxs, Fragment };
