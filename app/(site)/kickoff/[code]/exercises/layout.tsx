import { Text } from "@/components/Text"
import { LightLayout } from "@/components/LightLayout"
import { getParticipantOrThrow } from "@/lib/getParticipantOrThrow"

const ExercisesLayout = async (props: { children: React.ReactNode }) => {
	const participant = await getParticipantOrThrow()

	return (
		<LightLayout
			mainClassName="mt-3.5"
			headerChildren={
				<Text style="copy" size={16} className="ml-6 mr-auto">
					Hi, <span className="underline">{participant.name}</span>
				</Text>
			}
		>
			{props.children}
		</LightLayout>
	)
}

export default ExercisesLayout
