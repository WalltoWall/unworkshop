import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { PresenterHeader } from "../../PresenterHeader"
import { BrainstormPresenterView } from "./_BrainstormExercise/BrainstormPresenterView"
import { FormPresenterView } from "./_FormExercise/"
import { QuadrantsPresenterView } from "./_QuadrantsExercise/QuadrantsPresenterView"
import { SlidersPresenterView } from "./_SlidersExercise/SlidersPresenterView"

type Params = Promise<{ code: string; slug: string }>
type Props = {
	params: Params
}

const PresenterExercisePage = async (props: Props) => {
	const params = await props.params
	const kickoff = await client.findKickoffOrThrow(params.code)
	if (!kickoff) notFound()

	const exercise = await client.findExerciseBySlug(params.slug)
	if (!exercise) notFound()

	const exercises = kickoff.exercises ?? []

	return (
		<>
			<PresenterHeader
				kickoffCode={params.code}
				exercises={exercises}
				exercise={exercise}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormPresenterView exercise={exercise} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsPresenterView exercise={exercise} />
			)}
			{exercise.type === "form" && (
				<FormPresenterView kickoff={kickoff} exercise={exercise} />
			)}

			{exercise.type === "sliders" && (
				<SlidersPresenterView exercise={exercise} />
			)}
		</>
	)
}

export default PresenterExercisePage
