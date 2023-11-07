import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./BrainstormExercise"
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
		<div>
			<Text style="heading" size={40} asChild>
				<h1>{exercise.name}</h1>
			</Text>

			{exercise.type === "brainstorm" && <BrainstormExercise />}
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
