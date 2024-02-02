"use client"

import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"
// import { client } from "@/sanity/client"
import type { GroupExercise, GroupParticipant } from "./groups/types"
import { useMultiplayerGroups } from "./groups/use-multiplayer-groups"

interface RoleHeaderProps {
	exercise: GroupExercise
	participantId: string
}

export const RoleHeader = ({ exercise, participantId }: RoleHeaderProps) => {
	const { snap } = useMultiplayerGroups({
		exerciseId: exercise._id,
		participantId,
	})

	const groupData = snap.groups?.[participantId]
	const groupName = exercise.groups?.find(
		(g) => g.slug.current === groupData?.slug,
	)?.name

	return groupData ? (
		<div className="-mx-7 -mt-3.5 mb-6 flex items-center justify-center bg-gray-50 p-4 text-white">
			<PencilCircle className="mr-1 w-5" />
			<Text size={16}>
				You're{" "}
				{groupData.role === "captain" ? (
					<>
						the <strong>Captain</strong>
					</>
				) : (
					<>
						a <strong>Contributor</strong>
					</>
				)}{" "}
				of <strong>{groupName}</strong>
			</Text>
		</div>
	) : null
}
