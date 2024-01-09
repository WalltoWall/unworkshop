import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import type { GroupParticipant } from "./groups/types"

interface RoleHeaderProps {
	exerciseId: string
}

export const RoleHeader = async ({ exerciseId }: RoleHeaderProps) => {
	const participant = await client.findParticipantOrThrow<GroupParticipant>()
	const meta = participant.answers?.[exerciseId]?.meta

	return meta && meta.type === "group" ? (
		<div className="-mx-7 -mt-3.5 mb-6 flex items-center justify-center bg-gray-50 p-4 text-white">
			<PencilCircle className="mr-1 w-5" />
			<Text size={16}>
				You're{" "}
				{meta.role === "captain" ? (
					<>
						the <strong>Captain</strong>
					</>
				) : (
					<>
						a <strong>Contributor</strong>
					</>
				)}{" "}
				of <strong>{meta.group}</strong>
			</Text>
		</div>
	) : null
}
