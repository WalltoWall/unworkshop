import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import type { GroupParticipant } from "../types"
import { GroupExerciseSubmissionForm } from "./GroupExerciseSubmissionForm.tsx"

type Props = {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExercisePage = async (props: Props) => {
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(props.params.slug),
		client.findParticipantOrThrow<GroupParticipant>(),
	])
	if (!exercise) notFound()

	return (
		<GroupExerciseSubmissionForm
			exercise={exercise}
			participant={participant}
			groupSlug={props.params.groupSlug}
		/>
	)
}

export default GroupExercisePage
