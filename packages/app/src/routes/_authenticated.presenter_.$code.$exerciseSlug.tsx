import { Colors } from "@/colors"
import { Api } from "@/sanity/api"
import { SlidersPresenterComponent } from "@/sliders/presenter/component"
import { SlidersSettings } from "@/sliders/presenter/use-sliders-settings"
import {
	createFileRoute,
	notFound,
	stripSearchParams,
} from "@tanstack/react-router"
import { match } from "ts-pattern"
import { z } from "zod"

const defaultSearch = {
	step: 1,
	color: Colors.fallback,
	sliders: SlidersSettings.fallback,
}

export const Route = createFileRoute(
	"/_authenticated/presenter_/$code/$exerciseSlug",
)({
	component: RouteComponent,
	loader: async ({ params }) => {
		const exercise = await Api.getExercise(params.code, params.exerciseSlug)
		if (!exercise) throw notFound()

		return { exercise }
	},

	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData.exercise.name} | UnWorkshop` }],
	}),
	validateSearch: z.object({
		step: z.number().min(1).default(defaultSearch.step),
		color: Colors.Variant.default(defaultSearch.color),
		sliders: SlidersSettings.Schema.default(defaultSearch.sliders),
	}),
	search: {
		middlewares: [
			stripSearchParams({
				step: defaultSearch.step,
				color: defaultSearch.color,
				sliders: defaultSearch.sliders,
			}),
		],
	},
})

function RouteComponent() {
	const { exercise } = Route.useLoaderData()

	return match(exercise)
		.with({ type: "sliders" }, (e) => (
			<SlidersPresenterComponent steps={e.steps} />
		))
		.exhaustive()
}
