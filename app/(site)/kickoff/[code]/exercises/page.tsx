import * as R from "remeda"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import type { GroupExercise } from "./[slug]/groups/types"
import { CardGradientSequence } from "./card-gradients"
import { CardIllustrationSequence, illustrations } from "./card-illustrations"
import { ExerciseCard } from "./ExerciseCard"

type Params = { code: string }
type Props = {
	params: Promise<Params>
}

const ExercisesPage = async (props: Props) => {
	const params = await props.params
	const [participant, kickoff] = await Promise.all([
		client.findParticipantOrThrow(),
		client.findKickoffOrThrow(params.code),
	])

	const gradientSequence = new CardGradientSequence()
	const illustrationSequence = new CardIllustrationSequence()

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul className="mt-6 grid gap-4">
				{kickoff.exercises?.map((exercise: GroupExercise) => {
					const groups = exercise.groups ?? []

					const groupSlug = R.pipe(
						R.values(exercise.answers?.groups ?? {}),
						R.find(
							(group) =>
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
								illustration={
									exercise.illustration
										? illustrations[exercise.illustration]
										: illustrationSequence.nextVariant()
								}
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
