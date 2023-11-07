import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"

const ExercisesLayout = async (props: { children: React.ReactNode }) => {
	const participant = await client.findParticipantOrThrow()

	return (
		<LightLayout
			mainClassName="mt-3.5"
			headerChildren={
				<Text style="copy" size={16} className="ml-4 mr-auto">
					Hi, <span className="underline">{participant.name}</span>
				</Text>
			}
		>
			{props.children}
		</LightLayout>
	)
}

export default ExercisesLayout
