import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "./_QuadrantsExercise/QuadrantsExercise"
import { SlidersExercise } from "./_SlidersExercise/SlidersExercise"
import { FormExercise } from "./FormsExercise"
import { InstructionsModal } from "./InstructionsModal"
import { RoleHeader } from "./RoleHeader"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<div className="h-full">
			<RoleHeader exerciseId={exercise._id} />

			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise
					exercise={exercise}
					kickoffCode={props.params.code}
				/>
			)}
			{exercise.type === "sliders" && <SlidersExercise exercise={exercise} />}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise
					exercise={exercise}
					kickoffCode={props.params.code}
				/>
			)}
			{exercise.type === "form" && (
				<FormExercise exercise={exercise} kickoffCode={props.params.code} />
			)}
		</div>
	)
}

export default ExercisePage
