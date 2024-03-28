import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { InstructionsModal } from "../InstructionsModal"
import { GroupForm } from "./GroupForm"
import type { GroupParticipant } from "./types"

type Props = {
	params: { code: string; slug: string }
}

const GroupsPage = async (props: Props) => {
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(props.params.slug),
		client.findParticipantOrThrow<GroupParticipant>(),
	])
	if (!exercise) notFound()

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
				pushHref={`/kickoff/${props.params.code}/exercises/${props.params.slug}/groups`}
			/>
		</div>
	)
}

export default GroupsPage
