import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "../../_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "../../_QuadrantsExercise/QuadrantsExercise"
import { SlidersExercise } from "../../_SlidersExercise/SlidersExercise"
import { FormExercise } from "../../FormsExercise"
import { GroupExerciseSubmissionForm } from "../GroupExerciseSubmissionForm"

type Params = { code: string; slug: string; groupSlug: string }
type Props = {
	params: Promise<Params>
}

const GroupExercisePage = async (props: Props) => {
	const params = await props.params
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(params.slug),
		client.findParticipantOrThrow(),
	])
	if (!exercise) notFound()

	return (
		<GroupExerciseSubmissionForm exercise={exercise} participant={participant}>
			{exercise.type === "brainstorm" && (
				<BrainstormExercise
					exercise={exercise}
					kickoffCode={params.code}
					groupSlug={params.groupSlug}
				/>
			)}

			{exercise.type === "sliders" && (
				<SlidersExercise exercise={exercise} groupSlug={params.groupSlug} />
			)}

			{exercise.type === "quadrants" && (
				<QuadrantsExercise
					exercise={exercise}
					kickoffCode={params.code}
					groupSlug={params.groupSlug}
					keepStepperActive
				/>
			)}

			{exercise.type === "form" && (
				<FormExercise exercise={exercise} groupSlug={params.groupSlug} />
			)}
		</GroupExerciseSubmissionForm>
	)
}

export default GroupExercisePage
