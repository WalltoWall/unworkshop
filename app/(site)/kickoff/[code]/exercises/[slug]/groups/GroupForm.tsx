"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { cx } from "class-variance-authority"
import type { ST } from "@/sanity/types.gen"
import { CaptainModal } from "./CaptainModal"
import { GroupRoleSelector } from "./GroupRoleSelector"
import { GroupSelector } from "./GroupSelector"
import { useMultiplayerGroups } from "./use-multiplayer-groups"

export type Role = "contributor" | "captain"

interface GroupFormProps {
	exerciseId: string
	participantId: string
	groups: ST["exercise"]["groups"]
	pushHref: string
}

export const GroupForm = ({
	exerciseId,
	participantId,
	groups,
	pushHref,
}: GroupFormProps) => {
	const router = useRouter()

	const { snap, actions } = useMultiplayerGroups({
		exerciseId,
		participantId,
	})

	const [openCaptainModal, setOpenCaptainModal] = React.useState(false)
	const [group, setGroup] = React.useState<string | null>(null)

	const currentCaptain =
		group && Object(snap.groups).length > 0
			? Object.keys(snap.groups[group]).find(
					(key) => snap.groups[group][key] === "captain",
				)
			: null

	const handleGroupChange = (role: Role) => {
		if (group && role) {
			if (currentCaptain && role === "captain") {
				setOpenCaptainModal(true)
			} else {
				actions.setGroup({
					slug: group,
					role,
				})

				router.push(`${pushHref}/${group}`)
			}
		}
	}

	const handleCancel = () => {
		setOpenCaptainModal(false)
	}

	const handleCaptainChange = () => {
		setOpenCaptainModal(false)

		actions.replaceCaptain({
			slug: group!,
			captainId: currentCaptain!,
		})

		router.push(`${pushHref}/${group}`)
	}

	return (
		<div>
			<div className={cx(group && "hidden")}>
				<GroupSelector groups={groups} setGroup={setGroup} />
			</div>

			<div className={cx(!group && "hidden")}>
				<GroupRoleSelector onGroupChange={handleGroupChange} />
			</div>

			<CaptainModal
				open={openCaptainModal}
				handleCancel={handleCancel}
				handleConfirm={handleCaptainChange}
			/>
		</div>
	)
}
