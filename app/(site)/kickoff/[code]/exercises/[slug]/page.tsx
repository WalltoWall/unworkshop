import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "./_QuadrantsExercise/QuadrantsExercise"

// import { QuadrantsExercise } from "./QuadrantsExercise"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<div className="h-full">
			<Text style="heading" size={40} asChild>
				<h1>{exercise.name}</h1>
			</Text>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise exercise={exercise} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise exercise={exercise} />
			)}
		</div>
	)
}

export default ExercisePage
