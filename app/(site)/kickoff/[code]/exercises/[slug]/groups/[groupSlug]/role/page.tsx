import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import { client } from "@/sanity/client"

const RoleSelector = dynamic(() => import("../../RoleSelector"), { ssr: false })

type Params = { code: string; slug: string; groupSlug: string }
type Props = {
	params: Promise<Params>
}

const GroupExerciseRoleSelectionPage = async (props: Props) => {
	const params = await props.params
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(params.slug),
		client.findParticipantOrThrow(),
	])
	if (!exercise) notFound()

	return <RoleSelector exercise={exercise} participant={participant} />
}

export default GroupExerciseRoleSelectionPage
