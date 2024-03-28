"use client"

import { Text } from "@/components/Text"
import captainIllustration from "@/assets/images/captain-illustration.png"
import contibutorIllustration from "@/assets/images/contributerImage.png"
import { InstructionsModal } from "../../InstructionsModal"
import { RoleHeader } from "../../RoleHeader"
import { RoleCard } from "../RoleCard"
import type { Group, GroupExercise, GroupParticipant, Role } from "../types"
import { useMultiplayerGroups } from "../use-multiplayer-groups"

interface Props {
	participant: GroupParticipant
	exercise: GroupExercise
	groupSlug: string
}

export const GroupExerciseSubmissionForm = ({
	participant,
	exercise,
	groupSlug,
}: Props) => {
	const { snap, actions } = useMultiplayerGroups({
		exerciseId: exercise._id,
		participantId: participant._id,
	})

	const group: Group | undefined = snap.groups[groupSlug]
	const role: Role | undefined = group?.[participant._id]

	const shouldShowRolePicker = !group || !role || role === "unset"

	const onRoleCardClick = (newRole: Role) =>
		actions.setRole({ role: newRole, slug: groupSlug })

	return (
		<div className="flex flex-[1_1_0] flex-col">
			{!shouldShowRolePicker && (
				<RoleHeader className="-mx-7 -mt-3.5 mb-7">YOooo</RoleHeader>
			)}

			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{shouldShowRolePicker && (
				<div className="mt-4">
					<Text size={16} className="mb-7">
						What's your role?
					</Text>

					<div className="flex flex-col gap-4">
						<RoleCard
							role="contributor"
							onClick={onRoleCardClick}
							img={contibutorIllustration}
							name="Contributor"
							instructions="I’ll add in my two-cents."
						/>
						<RoleCard
							role="captain"
							onClick={onRoleCardClick}
							img={captainIllustration}
							name="Captain"
							instructions="I’ll lead and write for my group."
						/>
					</div>
				</div>
			)}

			{/* {exercise.type === "brainstorm" && (
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
			)} */}
		</div>
	)
}
