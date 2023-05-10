import { Text } from "@/components/Text"
import { findKickoffOrThrow } from "@/sanity/client"

const ExercisesPage = async (props: { params: { code: string } }) => {
	const kickoff = await findKickoffOrThrow(props.params.code)

	console.log(kickoff.exercises)

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul>
				{kickoff.exercises.map((exercise) => (
					<li key={exercise._id}>{exercise.name}</li>
				))}
			</ul>
		</div>
	)
}

export const metadata = {
	title: "Exercises - W|W Workshop",
}

export default ExercisesPage
