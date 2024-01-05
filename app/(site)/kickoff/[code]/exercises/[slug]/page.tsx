import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { SlidersExercise } from "./_SlidersExercise/SlidersExercise"
import { FormExercise } from "./FormsExercise"
import { InstructionsModal } from "./InstructionsModal"
import { QuadrantsExercise } from "./QuadrantsExercise"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<div className="h-full">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise exercise={exercise} />
			)}
			{exercise.type === "sliders" && <SlidersExercise exercise={exercise} />}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise quadrants={exercise.quadrants} />
			)}
			{exercise.type === "form" && <FormExercise exercise={exercise} />}
		</div>
	)
}

export default ExercisePage
