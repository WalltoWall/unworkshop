import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "./_QuadrantsExercise/QuadrantsExercise"
import { SlidersExercise } from "./_SlidersExercise/SlidersExercise"
import { FormExercise } from "./FormsExercise"
import { RoleHeader } from "./RoleHeader"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)

	if (!exercise) notFound()

	return (
		<div className="flex flex-[1_1_0] flex-col">
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
			{exercise.type === "form" && <FormExercise exercise={exercise} />}
		</div>
	)
}

export default ExercisePage
