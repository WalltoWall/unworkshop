import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router"
import { GlobalProviders } from "@/components/global-providers"

export const Route = createRootRoute({
	component: () => (
		<>
			<HeadContent />
			<GlobalProviders>
				<Outlet />
			</GlobalProviders>
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
