import { type Context } from "../main.tsx";
import { Layout } from "./layout.tsx";

function Floorplan({ title, children }: JSX.Props<{ title: string }>) {
	return (
		<Layout title={title}>
			<p>Pretend this is the floorplan</p>
			{children}
		</Layout>
	);
}

export function Book() {
	return <Floorplan title="Book a desk" />;
}

export function BookDesk(c: Context) {
	let desk = c.params.desk_id;
	return (
		<Floorplan title={`Book desk ${desk}`}>
			<p>Book desk {desk}</p>
		</Floorplan>
	);
}
