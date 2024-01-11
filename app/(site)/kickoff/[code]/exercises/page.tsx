import { redirect } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { ExerciseCard } from "./ExerciseCard"

const ExercisesPage = async (props: { params: { code: string } }) => {
	const [participant, kickoff] = await Promise.all([
		client.findParticipantOrThrow(),
		client.findKickoffOrThrow(props.params.code),
	])

	if (!participant.onboarded) redirect(`/kickoff/${props.params.code}`)

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul className="mt-6 grid gap-4">
				{kickoff.exercises.map((exercise) => {
					const groups = exercise.groups ?? []
					const meta = participant.answers?.[exercise._id]?.meta

					return (
						<li key={exercise._id}>
							<ExerciseCard
								kickoffCode={kickoff.code.current}
								name={exercise.name}
								slug={exercise.slug.current}
								type={exercise.type}
								needsGroup={groups.length > 0 && !meta}
							/>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export const metadata = {
	title: "Exercises - W|W Workshop",
}

export default ExercisesPage
