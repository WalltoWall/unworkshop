import { NavSheet } from "@/components/nav-sheet"
import { ExerciseCard } from "@/components/exercise-card"
import { Logo } from "@/components/Logo"
import { CardGradientSequence } from "@/lib/card-gradients"
import { illustrations } from "@/lib/card-illustrations"
import { slugify } from "@/lib/slugify"
import { Api } from "@/sanity/api"
import { text } from "@/styles/text"
import {
	createFileRoute,
	Link,
	notFound,
	Outlet,
	useMatches,
} from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/presenter_/$code")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ name: "color-scheme", content: "light" },
			{ name: "theme-color", content: "#fff" },
		],
	}),
	loader: async ({ params }) => {
		const kickoff = await Api.getKickoff(params.code)
		if (!kickoff) throw notFound()

		return { kickoff }
	},
})

function RouteComponent() {
	const { kickoff } = Route.useLoaderData()
	const params = Route.useParams()
	const matches = useMatches()
	const gradientSequence = new CardGradientSequence()

	const isPresenterCodeLanding =
		matches.at(-1)?.routeId === "/_authenticated/presenter_/$code"

	return (
		<div className="flex h-svh flex-col">
			<header className="flex items-center justify-between gap-5 bg-black px-5 py-4.5 text-white">
				<Link
					className="flex gap-5"
					to="/presenter/$code"
					params={{ code: params.code }}
				>
					<Logo className="size-13 text-white" />

					<h1 className={text({ size: 48, style: "heading" })}>
						{kickoff.title}
					</h1>
				</Link>

				<NavSheet exercises={kickoff.exercises} />
			</header>

			<main className="flex grow flex-col">
				{isPresenterCodeLanding ? (
					<ul className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
						{kickoff.exercises.map((e) => (
							<li key={e.name}>
								<ExerciseCard
									to="/presenter/$code/$exerciseSlug"
									params={{
										code: params.code,
										exerciseSlug: slugify(e.name),
									}}
									name={e.name}
									gradient={gradientSequence.nextClassName()}
									illustration={
										illustrations[e.illustration] ?? illustrations.speechBubbles
									}
									label="View answers"
								/>
							</li>
						))}
					</ul>
				) : (
					<Outlet />
				)}
			</main>
		</div>
	)
}
