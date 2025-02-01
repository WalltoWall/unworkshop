import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { InstructionsModal } from "../InstructionsModal"
import { GroupSelector } from "./GroupSelector"

type Params = Promise<{ code: string; slug: string }>
type Props = { params: Params }

const GroupsPage = async (props: Props) => {
	const params = await props.params
	const exercise = await client.findExerciseBySlug(params.slug)
	if (!exercise) notFound()

	const groups = exercise.groups ?? []

	return (
		<div className="h-full">
			<InstructionsModal exerciseName={exercise.name} />
			<GroupSelector groups={groups} />
		</div>
	)
}

export default GroupsPage
