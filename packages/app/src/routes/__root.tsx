import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
	component: () => <Outlet />,
	errorComponent: ({ error }) => {
		console.log(error)
		return <div>error</div>
	},
	notFoundComponent: () => <div>Not found</div>,
})
