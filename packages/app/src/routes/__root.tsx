import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router"

export const Route = createRootRoute({
	component: () => (
		<>
			<HeadContent />
			<Outlet />
			<Scripts />
		</>
	),
	head: () => ({
		meta: [
			{ name: "description", content: "Look in. Stand out." },
			{ title: "UnWorkshop" },
		],
	}),
	errorComponent: () => <div>Something went wrong</div>,
	notFoundComponent: () => <div>Not found</div>,
})
