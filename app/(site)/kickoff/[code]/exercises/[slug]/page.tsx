import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { InstructionsModal } from "./InstructionsModal"
import { QuadrantsExercise } from "./QuadrantsExercise"
import { SlidersExercise } from "./SlidersExercise"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	console.log({ exercise })

	return (
		<div className="h-full">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise exercise={exercise} />
			)}
			{exercise.type === "sliders" && (
				<SlidersExercise sliders={exercise.sliders} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise quadrants={exercise.quadrants} />
			)}
		</div>
	)
}

export default ExercisePage
