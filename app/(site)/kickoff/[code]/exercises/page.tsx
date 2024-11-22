import { redirect } from "next/navigation"
import * as R from "remeda"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import type { GroupExercise } from "./[slug]/groups/types"
import { CardGradientSequence } from "./card-gradients"
import { CardIllustrationSequence } from "./card-illustrations"
import { ExerciseCard } from "./ExerciseCard"

const gradientSequence = new CardGradientSequence([
	"orangeToGreen",
	"purpleToOrange",
	"tealToGreen",
	"blueToPurple",
])
const illustrationSequence = new CardIllustrationSequence([
	"form",
	"sliders",
	"quadrants",
	"brainstorm",
])

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
				{kickoff.exercises?.map((exercise: GroupExercise) => {
					const groups = exercise.groups ?? []

					const groupSlug = R.pipe(
						R.entries(exercise.answers?.groups ?? {}),
						R.find(
							([_gSlug, group]) =>
								group[participant._id] === "captain" ||
								group[participant._id] === "contributor",
						),
						(result) => result?.[0],
					)

					return (
						<li key={exercise._id}>
							<ExerciseCard
								kickoffCode={kickoff.code.current}
								name={exercise.name}
								slug={exercise.slug.current}
								type={exercise.type}
								groups={groups.length > 0}
								groupSlug={groupSlug}
								gradient={gradientSequence.nextClassName()}
								illustration={illustrationSequence.nextVariant()}
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
