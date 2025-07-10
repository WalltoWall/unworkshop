import { Api } from "@/sanity/api"
import {
	createFileRoute,
	notFound,
	Outlet,
	stripSearchParams,
	useMatches,
} from "@tanstack/react-router"
import { text } from "@/styles/text"
import { z } from "zod"
import { Exercise } from "@/components/exercise"

const defaultValues = { step: 1 }

export const Route = createFileRoute("/kickoff/$code_/$exerciseSlug")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const exercise = await Api.getExercise(params.code, params.exerciseSlug)
		if (!exercise) throw notFound()

		return { exercise }
	},
	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData?.exercise.name} | UnWorkshop` }],
	}),
	validateSearch: z.object({
		step: z.number().min(1).default(defaultValues.step),
	}),
	search: {
		middlewares: [stripSearchParams({ step: defaultValues.step })],
	},
})

function RouteComponent() {
	const { exercise } = Route.useLoaderData()
	const matches = useMatches()

	const isExerciseLanding =
		matches.at(-1)?.routeId === "/kickoff/$code_/$exerciseSlug"

	return (
		<div className="flex grow flex-col">
			<h1 className={text({ size: 40, style: "heading" })}>{exercise.name}</h1>
			{isExerciseLanding ? <Exercise exercise={exercise} /> : <Outlet />}
		</div>
	)
}
