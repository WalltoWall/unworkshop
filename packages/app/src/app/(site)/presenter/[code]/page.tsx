import { notFound } from "next/navigation"
import { ExerciseCard } from "@/components/exercise-card"
import { CardGradientSequence } from "@/lib/card-gradients"
import { illustrations } from "@/lib/card-illustrations"
import { slugify } from "@/lib/slugify"
import { Api } from "@/sanity/client"

type Params = { code: string }
type Props = { params: Promise<Params> }

export default async function PresenterPage(props: Props) {
	const params = await props.params
	const kickoff = await Api.getKickoff(params.code)
	if (!kickoff) notFound()

	const gradientSequence = new CardGradientSequence()

	return (
		<ul className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			{kickoff.exercises.map((e) => (
				<li key={e.name}>
					<ExerciseCard
						href={`/presenter/${params.code}/${slugify(e.name)}`}
						name={e.name}
						gradient={gradientSequence.nextClassName()}
						illustration={illustrations[e.illustration]}
						label="View answers"
					/>
				</li>
			))}
		</ul>
	)
}
