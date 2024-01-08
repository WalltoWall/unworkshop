import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { ExerciseCard } from "@/app/(site)/kickoff/[code]/exercises/ExerciseCard"
import { PresenterHeader } from "../PresenterHeader"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const PresenterKickOffPage = async (props: Props) => {
	const kickoff = await client.findKickoffOrThrow(props.params.code)

	if (!kickoff) notFound()

	return (
		<>
			<PresenterHeader
				kickoffCode={props.params.code}
				exercises={kickoff.exercises}
			/>
			<div className="space-y-4 px-7 py-8">
				<Text style="heading" size={40}>
					Exercises
				</Text>

				<ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{kickoff.exercises.map((exercise) => (
						<li key={exercise._id}>
							<ExerciseCard
								kickoffCode={kickoff.code.current}
								name={exercise.name}
								slug={exercise.slug.current}
								type={exercise.type}
								presenter
							/>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default PresenterKickOffPage
