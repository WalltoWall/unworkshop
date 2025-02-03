import { notFound } from "next/navigation"
import { ExerciseCard } from "@/components/exercise-card"
import { Text } from "@/components/Text"
import { CardGradientSequence } from "@/lib/card-gradients"
import { illustrations } from "@/lib/card-illustrations"
import { slugify } from "@/lib/slugify"
import { Api } from "@/sanity/client"

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
				{kickoff.exercises.map((e) => {
					const hasGroups = e.groups && e.groups.length > 0
					const slug = slugify(e.name)
					const href = hasGroups
						? `/kickoff/${params.code}/groups/${slug}`
						: `/kickoff/${params.code}/${slug}`

					return (
						<li key={e.name}>
							<ExerciseCard
								href={href}
								name={e.name}
								gradient={gradientSequence.nextClassName()}
								illustration={illustrations[e.illustration]}
							/>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export const metadata = { title: "Exercises" }
