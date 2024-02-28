import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "../../_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "../../_QuadrantsExercise/QuadrantsExercise"
import { SlidersExercise } from "../../_SlidersExercise/SlidersExercise"
import { InstructionsModal } from "../../InstructionsModal"
import { RoleHeader } from "../../RoleHeader"
import type { GroupParticipant } from "../types"

type Props = {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	const participant = await client.findParticipantOrThrow<GroupParticipant>()

	if (!exercise) notFound()

	return (
		<div className="flex flex-[1_1_0] flex-col">
			<RoleHeader exercise={exercise} participantId={participant._id} />

			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise
					exercise={exercise}
					kickoffCode={props.params.code}
					groupSlug={props.params.groupSlug}
				/>
			)}

			{exercise.type === "sliders" && (
				<SlidersExercise
					exercise={exercise}
					groupSlug={props.params.groupSlug}
				/>
			)}

			{exercise.type === "quadrants" && (
				<QuadrantsExercise
					exercise={exercise}
					groupSlug={props.params.groupSlug}
					kickoffCode={props.params.code}
				/>
			)}
		</div>
	)
}

export default GroupExercisePage
