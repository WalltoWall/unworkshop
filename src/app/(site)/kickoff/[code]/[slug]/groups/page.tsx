import { notFound } from "next/navigation"
import { Api } from "@/sanity/client"
import { GroupLink } from "./group-link"

type Params = { code: string; slug: string }
type Props = { params: Promise<Params> }

export default async function ExerciseGroupPage(props: Props) {
	const params = await props.params
	const exercise = await Api.getExercise(params.code, params.slug)
	if (!exercise || !exercise.groups) notFound()
	if (exercise.groups.length < 2) {
		throw new Error("Invalid group configuration. Must be at least 2 groups.")
	}

	return (
		<div className="flex flex-col gap-7">
			<p>Tap on or select the group you are assigned to.</p>
			<ul className="flex flex-col gap-2">
				{exercise.groups.map((group) => (
					<GroupLink
						key={group}
						group={group}
						code={params.code}
						slug={params.slug}
					/>
				))}
			</ul>
		</div>
	)
}
