import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { PresenterHeader } from "../../PresenterHeader"

type Props = {
	params: { code: string; slug: string }
}

const PresenterExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<>
			<PresenterHeader heading={exercise.name} />
		</>
	)
}

export default PresenterExercisePage
