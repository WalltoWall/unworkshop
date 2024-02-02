import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { InstructionsModal } from "../InstructionsModal"
import { GroupForm } from "./GroupForm"
import type { GroupParticipant } from "./types"

type Props = {
	params: { code: string; slug: string }
}

const GroupsPage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)

	if (!exercise) notFound()

	const participant = await client.findParticipantOrThrow<GroupParticipant>()

	const groups = exercise.groups ?? []

	return (
		<div className="h-full">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions="Select the group you will be a part of, then select your role within the group."
			/>

			<GroupForm
				groups={groups}
				exerciseId={exercise._id}
				participantId={participant._id}
				backHref={`/kickoff/${props.params.code}/exercises/${props.params.slug}`}
			/>
		</div>
	)
}

export default GroupsPage
