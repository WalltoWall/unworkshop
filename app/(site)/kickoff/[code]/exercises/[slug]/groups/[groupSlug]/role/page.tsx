import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import { client } from "@/sanity/client"

const RoleSelector = dynamic(() => import("../../RoleSelector"), { ssr: false })

type Props = {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExerciseRoleSelectionPage = async (props: Props) => {
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(props.params.slug),
		client.findParticipantOrThrow(),
	])
	if (!exercise) notFound()

	return <RoleSelector exercise={exercise} participant={participant} />
}

export default GroupExerciseRoleSelectionPage
