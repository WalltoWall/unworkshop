import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { Api } from "@/sanity/client"
import { CardGradientSequence } from "./exercises/card-gradients"
import { illustrations } from "./exercises/card-illustrations"
import { ExerciseCard } from "./exercises/exercise-card"

type Params = { code: string }
type Props = { params: Promise<Params> }

export default async function KickoffPage(props: Props) {
	const params = await props.params
	const kickoff = await Api.getKickoff(params.code)
	if (!kickoff) notFound()

	const gradientSequence = new CardGradientSequence()

	return (
		<div className="space-y-6">
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul className="grid gap-4">
				{kickoff.exercises.map((e) => (
					<li key={e.name}>
						<ExerciseCard
							href="/"
							name={e.name}
							gradient={gradientSequence.nextClassName()}
							illustration={
								illustrations[e.illustration] || illustrations.clocksAndHands
							}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

export const metadata = { title: "Exercises" }
