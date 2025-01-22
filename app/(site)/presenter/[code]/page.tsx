import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { ExerciseCard } from "@/app/(site)/kickoff/[code]/exercises/ExerciseCard"
import { CardGradientSequence } from "../../kickoff/[code]/exercises/card-gradients"
import {
	CardIllustrationSequence,
	illustrations,
} from "../../kickoff/[code]/exercises/card-illustrations"
import { PresenterHeader } from "../PresenterHeader"

type Params = { code: string }
type Props = { params: Promise<Params> }

const PresenterKickOffPage = async (props: Props) => {
	const params = await props.params
	const kickoff = await client.findKickoff(params.code)
	if (!kickoff) notFound()

	const gradientSequence = new CardGradientSequence()
	const illustrationSequence = new CardIllustrationSequence()

	return (
		<>
			<PresenterHeader
				kickoffCode={params.code}
				exercises={kickoff.exercises ?? []}
			/>
			<div className="space-y-4 px-7 py-8">
				<Text style="heading" size={40}>
					Exercises
				</Text>

				<ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{kickoff.exercises?.map((exercise) => (
						<li key={exercise._id}>
							<ExerciseCard
								kickoffCode={kickoff.code.current}
								name={exercise.name}
								slug={exercise.slug.current}
								type={exercise.type}
								presenter
								gradient={gradientSequence.nextClassName()}
								illustration={
									exercise.illustration
										? illustrations[exercise.illustration]
										: illustrationSequence.nextVariant()
								}
							/>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default PresenterKickOffPage
