"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { cx } from "class-variance-authority"
import type { ST } from "@/sanity/config"
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

	const { actions } = useMultiplayerGroups({
		exerciseId,
		participantId,
	})

	const [group, setGroup] = React.useState<string | null>(null)

	const handleGroupChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
		const role = event.target?.value

		if (group && role) {
			actions.setGroup({
				slug: group,
				role,
			})

			router.push(`${pushHref}/${group}`)
		}
	}

	return (
		<div>
			<div className={cx(group && "hidden")}>
				<GroupSelector groups={groups} setGroup={setGroup} />
			</div>

			<div className={cx(!group && "hidden")}>
				<GroupRoleSelector onGroupChange={handleGroupChange} />
			</div>
		</div>
	)
}
