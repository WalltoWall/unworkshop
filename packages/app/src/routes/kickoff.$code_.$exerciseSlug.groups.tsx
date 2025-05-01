import { slugify } from "@/lib/slugify"
import { text } from "@/styles/text"
import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

export const Route = createFileRoute("/kickoff/$code_/$exerciseSlug/groups")({
	component: RouteComponent,
})

const exerciseRoute = getRouteApi("/kickoff/$code_/$exerciseSlug")

function RouteComponent() {
	const data = exerciseRoute.useLoaderData()
	const groups = data.exercise.groups ?? []
	const params = Route.useParams()

	return (
		<div className="flex flex-col gap-7">
			<p>Tap on or select the group you are assigned to.</p>
			<ul className="flex flex-col gap-2">
				{groups.map((group) => (
					<li key={group}>
						<Link
							to="/kickoff/$code/$exerciseSlug/groups/$groupSlug"
							params={{
								code: params.code,
								exerciseSlug: params.exerciseSlug,
								groupSlug: slugify(group),
							}}
							className="hover:bg-brand focus:bg-brand flex items-center justify-between rounded-lg bg-neutral-200 px-3 pt-3.5 pb-4 leading-none transition"
						>
							<p className={text({ size: 32, style: "heading" })}>{group}</p>
							<ArrowRightIcon className="mt-1 size-5" strokeWidth={3} />
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
