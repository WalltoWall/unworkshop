import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./BrainstormExercise"
import { QuadrantsExercise } from "./QuadrantsExercise"

// import { QuadrantsExercise } from "./QuadrantsExercise"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	console.log(exercise)

	return (
		<div className="h-full">
			<Text style="heading" size={40} asChild>
				<h1>{exercise.name}</h1>
			</Text>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise steps={exercise.steps} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise
					quadrants={exercise.quadrants}
					todayInstructions={exercise.today_instructions}
					tomorrowInstructions={exercise.tomorrow_instructions}
					finalInstructions={exercise.finalize_instructions}
				/>
			)}
		</div>
	)
}

export default ExercisePage
