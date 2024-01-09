import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { InstructionsModal } from "../InstructionsModal"
import { GroupForm } from "./GroupForm"

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
				instructions={exercise.instructions}
			/>

			<GroupForm
				groups={groups}
				exerciseId={exercise._id}
				backHref={`/kickoff/${props.params.code}/exercises/${props.params.slug}`}
			/>
		</div>
	)
}

export default GroupsPage
