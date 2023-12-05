import { notFound } from "next/navigation"
import { QuestionMark } from "@/components/icons/QuestionMark"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
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
			<InstructionsModal exerciseName={exercise.name} />

			{exercise.type === "brainstorm" && (
				<BrainstormExercise exercise={exercise} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise quadrants={exercise.quadrants} />
			)}
		</div>
	)
}

export default ExercisePage
