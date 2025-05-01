import { Exercise } from "@/components/exercise"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute(
	"/kickoff/$code_/$exerciseSlug/groups_/$groupSlug",
)({
	component: RouteComponent,
})

function RouteComponent() {
	const data = useLoaderData({ from: "/kickoff/$code_/$exerciseSlug" })

	return <Exercise exercise={data.exercise} />
}
