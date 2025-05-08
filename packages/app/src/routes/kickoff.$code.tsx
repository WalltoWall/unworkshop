import { Api } from "@/sanity/api"
import { createFileRoute, linkOptions, notFound } from "@tanstack/react-router"
import { slugify } from "@/lib/slugify"
import { CardGradientSequence } from "@/lib/card-gradients"
import { ExerciseCard } from "@/components/exercise-card"
import { illustrations } from "@/lib/card-illustrations"
import { text } from "@/styles/text"

export const Route = createFileRoute("/kickoff/$code")({
	component: RouteComponent,
	head: () => ({
		meta: [{ title: "Exercises | UnWorkshop" }],
	}),
	loader: async ({ params }) => {
		const kickoff = await Api.getKickoff(params.code)
		if (!kickoff) throw notFound()

		return { kickoff }
	},
})

function RouteComponent() {
	const params = Route.useParams()
	const data = Route.useLoaderData()
	const gradientSequence = new CardGradientSequence()

	return (
		<div className="space-y-6">
			<p className={text({ style: "heading", size: 40 })}>Exercises</p>

			<ul className="grid gap-4">
				{data.kickoff.exercises.map((e) => {
					const slug = slugify(e.name)
					const soloOpts = linkOptions({
						to: "/kickoff/$code/$exerciseSlug",
						params: { code: params.code, exerciseSlug: slug },
					})
					const groupOpts = linkOptions({
						to: "/kickoff/$code/$exerciseSlug/groups",
						params: { code: params.code, exerciseSlug: slug },
					})

					const numGroups = e.groups?.length ?? 0
					const opts = numGroups > 0 ? groupOpts : soloOpts
					const illustration =
						illustrations[e.illustration] ?? illustrations.speechBubbles

					return (
						<li key={e.name}>
							<ExerciseCard
								{...opts}
								name={e.name}
								gradient={gradientSequence.nextClassName()}
								illustration={illustration}
							/>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
