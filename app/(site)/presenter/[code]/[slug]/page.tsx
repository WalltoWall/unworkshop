import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { PresenterHeader } from "../../PresenterHeader"
import { BrainstormPresenterView } from "./_BrainstormExercise/BrainstormPresenterView"
import { SlidersPresenterView } from "./_SlidersExercise/SlidersPresenterView"
import { QuadrantsPresenterView } from "./_QuadrantsExercise/QuadrantsPresenterView"

type Props = {
	params: { code: string; slug: string }
}

const PresenterExercisePage = async (props: Props) => {
	const kickoff = await client.findKickoffOrThrow(props.params.code)
	if (!kickoff) notFound()

	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<>
			<PresenterHeader
				kickoffCode={props.params.code}
				exercises={kickoff.exercises}
				activeExercise={exercise}
				heading={exercise.name}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormPresenterView exercise={exercise} />
			)}
			{exercise.type === "sliders" && (
				<SlidersPresenterView exercise={exercise} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsPresenterView exercise={exercise} />
			)}
		</>
	)
}

export default PresenterExercisePage
