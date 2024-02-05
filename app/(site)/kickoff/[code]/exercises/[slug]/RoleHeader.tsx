"use client"

import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"
import type { GroupExercise } from "./groups/types"
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

	const groupData = snap.groups

	return groupData ? (
		<>
			{exercise.groups?.map((group) => {
				if (groupData[group.slug.current]?.[participantId]) {
					const role = groupData[group.slug.current]?.[participantId]

					return (
						<div
							className="-mx-7 -mt-3.5 mb-6 flex items-center justify-center bg-gray-50 p-4 text-white"
							key={group.slug.current}
						>
							<PencilCircle className="mr-1 w-5" />
							<Text size={16}>
								You're{" "}
								{role === "captain" ? (
									<>
										the <strong>Captain</strong>
									</>
								) : (
									<>
										a <strong>Contributor</strong>
									</>
								)}{" "}
								of <strong>{group.name}</strong>
							</Text>
						</div>
					)
				}

				return null
			})}
		</>
	) : null
}
