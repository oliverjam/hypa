import { context } from "../main.tsx";

let css = String.raw;

export function Layout({ title, children }: JSX.Props<{ title: string }>) {
	let { url } = context();
	return (
		<html lang="en">
			<head>
				<title>{title}</title>
				<style>
					{css`
						[aria-current="true"] {
							color: pink;
						}
					`}
				</style>
			</head>
			<body>
				<nav>
					<NavLink href="/" pathname={url.pathname}>
						Bookings
					</NavLink>
					<NavLink href="/history" pathname={url.pathname}>
						History
					</NavLink>
				</nav>
				{children}
			</body>
		</html>
	);
}

type NavLinkProps = JSX.Props<{ href: string; pathname: string }>;

function NavLink({ href, pathname, children }: NavLinkProps) {
	return (
		<a
			href={href}
			aria-current={pathname === href}
			//  class="aria-[current=true]:text-pink-600 hover:underline"
		>
			{children}
		</a>
	);
}
