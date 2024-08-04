import { type Context } from "../main.tsx";
import { Layout } from "./layout.tsx";

export function Profile(c: Context) {
	let user = c.get("user");
	return (
		<Layout title="Your bookings">
			<main>
				<h1>Your bookings</h1>
				<div>
					<p>Hello {user.name}</p>
					<p>You don't have any bookings</p>
				</div>
			</main>
		</Layout>
	);
}
