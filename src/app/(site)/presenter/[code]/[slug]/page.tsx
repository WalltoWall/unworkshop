import { notFound } from "next/navigation"
import { match } from "ts-pattern"
import { Api } from "@/sanity/client"
import { SlidersPresenterComponent } from "@/sliders/presenter/component"

type Params = Promise<{ code: string; slug: string }>
type Props = { params: Params }

export default async function PresenterExercisePage(props: Props) {
	const params = await props.params
	const exercise = await Api.getExercise(params.code, params.slug)
	if (!exercise) notFound()

	return match(exercise)
		.with({ type: "sliders" }, (e) => (
			<SlidersPresenterComponent steps={e.steps} />
		))
		.otherwise(() => null)
}
