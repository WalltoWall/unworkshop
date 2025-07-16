import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./route-tree.gen"

export const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	scrollRestoration: true,
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
