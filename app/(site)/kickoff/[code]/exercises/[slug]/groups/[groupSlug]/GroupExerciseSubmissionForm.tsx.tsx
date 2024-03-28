"use client"

import React from "react"
import Link from "next/link"
import * as R from "remeda"
import { Text } from "@/components/Text"
import captainIllustration from "@/assets/images/captain-illustration.png"
import contibutorIllustration from "@/assets/images/contributerImage.png"
import { InstructionsModal } from "../../InstructionsModal"
import { RoleHeader } from "../../RoleHeader"
import { CaptainModal } from "../CaptainModal"
import { RoleCard } from "../RoleCard"
import type { Group, GroupExercise, GroupParticipant, Role } from "../types"
import { useMultiplayerGroups } from "../use-multiplayer-groups"

interface Props {
	participant: GroupParticipant
	exercise: GroupExercise
	groupSlug: string
	kickoffCode: string
	children: React.ReactNode
}

// TODO: Don't really like that rendering the exercise component or the group
// selector is a conditional based on state. I think having it separated into
// different routes would be ideal, as it would allow folks to seamlessly switch
// roles if they need to. It also preserves back/forward button behavior like
// the rest of the app does.
export const GroupExerciseSubmissionForm = ({
	participant,
	exercise,
	groupSlug,
	kickoffCode,
	children,
}: Props) => {
	const [captainModalOpen, setCaptainModalOpen] = React.useState(false)
	const { snap, actions } = useMultiplayerGroups({
		exerciseId: exercise._id,
		participantId: participant._id,
	})

	const groupParticipants: Group | undefined = snap.groups?.[groupSlug]
	const role: Role | undefined = groupParticipants?.[participant._id]
	const group = exercise.groups?.find((g) => g.slug.current === groupSlug)

	const shouldShowRolePicker = !groupParticipants || !role || role === "unset"

	const onRoleCardClick = (newRole: Role) => {
		const existingCaptain = R.pipe(
			groupParticipants ?? {},
			R.omit([participant._id]),
			R.values,
			R.find((role) => role === "captain"),
		)

		if (newRole === "captain" && existingCaptain) {
			return setCaptainModalOpen(true)
		}

		actions.setRole({ role: newRole, slug: groupSlug })
	}

	const onCaptainModalConfirm = () =>
		actions.replaceCaptain({ slug: groupSlug })

	const onCaptainModalCancel = () => setCaptainModalOpen(false)

	const onRoleHeaderClear = () =>
		actions.setRole({ slug: groupSlug, role: "unset" })

	return (
		<div className="flex flex-[1_1_0] flex-col">
			{!shouldShowRolePicker && group && (
				<RoleHeader
					className="-mx-7 -mt-3.5 mb-7"
					onClearClick={onRoleHeaderClear}
				>
					{role === "captain" ? (
						<>
							You are the <strong>captain</strong> of{" "}
							<strong>{group.name}</strong>.
						</>
					) : (
						<>
							You are a <strong>contributor</strong> in{" "}
							<strong>{group.name}</strong>.
						</>
					)}
				</RoleHeader>
			)}

			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{shouldShowRolePicker && (
				<div className="mt-4">
					<Text asChild size={16} className="mb-7">
						<div>
							What's your role?{" "}
							<Link
								href={`/kickoff/${kickoffCode}/exercises/${exercise.slug.current}/groups`}
								className="text-gray-19 underline"
							>
								Wrong group?
							</Link>
						</div>
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

					<CaptainModal
						open={captainModalOpen}
						onCancel={onCaptainModalCancel}
						onConfirm={onCaptainModalConfirm}
					/>
				</div>
			)}

			{!shouldShowRolePicker && children}
		</div>
	)
}
