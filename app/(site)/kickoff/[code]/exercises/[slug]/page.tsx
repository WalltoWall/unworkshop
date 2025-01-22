import { notFound, redirect } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "./_QuadrantsExercise/QuadrantsExercise"
import { SlidersExercise } from "./_SlidersExercise/SlidersExercise"
import { FormExercise } from "./FormsExercise"
import { InstructionsModal } from "./InstructionsModal"

type Params = { code: string; slug: string }
type Props = {
	params: Promise<Params>
}

const ExercisePage = async (props: Props) => {
	const params = await props.params
	const exercise = await client.findExerciseBySlug(params.slug)

	if (!exercise) notFound()
	if (exercise.groups && exercise.groups.length >= 1) {
		redirect(`/kickoff/${params.code}/exercises/${params.slug}/groups`)
	}

	return (
		<div className="flex flex-[1_1_0] flex-col">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise exercise={exercise} kickoffCode={params.code} />
			)}
			{exercise.type === "sliders" && <SlidersExercise exercise={exercise} />}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise exercise={exercise} kickoffCode={params.code} />
			)}
			{exercise.type === "form" && <FormExercise exercise={exercise} />}
		</div>
	)
}

export default ExercisePage
