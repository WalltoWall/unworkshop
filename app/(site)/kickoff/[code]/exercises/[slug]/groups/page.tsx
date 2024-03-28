import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { InstructionsModal } from "../InstructionsModal"
import { GroupSelector } from "./GroupSelector"

type Props = {
	params: { code: string; slug: string }
}

const GroupsPage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	const groups = exercise.groups ?? []

	return (
		<div className="h-full">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions="Select the group you will be a part of, then select your role within the group."
			/>

			<GroupSelector groups={groups} />
		</div>
	)
}

export default GroupsPage
