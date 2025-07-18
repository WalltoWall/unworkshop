import {
	createFileRoute,
	notFound,
	stripSearchParams,
} from "@tanstack/react-router"
import { match } from "ts-pattern"
import { z } from "zod"
import { BrainstormPresenterComponent } from "@/brainstorm/presenter/component"
import { BranstormSettings } from "@/brainstorm/presenter/use-brainstorm-settings"
import { Colors } from "@/colors"
import { Api } from "@/sanity/api"
import { SlidersPresenterComponent } from "@/sliders/presenter/component"
import { SlidersSettings } from "@/sliders/presenter/use-sliders-settings"

const defaultSearch = {
	step: 1,
	color: Colors.fallback,
	sliders: SlidersSettings.fallback,
	brainstorm: BranstormSettings.fallback,
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
		meta: [{ title: `${loaderData?.exercise.name} | UnWorkshop` }],
	}),
	validateSearch: z.object({
		step: z.number().min(1).default(defaultSearch.step),
		color: Colors.Variant.default(defaultSearch.color),
		sliders: SlidersSettings.Schema.default(defaultSearch.sliders),
		brainstorm: BranstormSettings.Schema.default(defaultSearch.brainstorm),
	}),
	search: {
		middlewares: [
			stripSearchParams({
				step: defaultSearch.step,
				color: defaultSearch.color,
				sliders: defaultSearch.sliders,
				brainstorm: defaultSearch.brainstorm,
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
		.with({ type: "brainstorm" }, (e) => (
			<BrainstormPresenterComponent steps={e.steps} />
		))
		.exhaustive()
}
