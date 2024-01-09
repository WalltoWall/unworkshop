"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { cx } from "class-variance-authority"
import type { ST } from "@/sanity/config"
import { submitGroupAction } from "./actions"
import { GroupRoleSelector } from "./GroupRoleSelector"
import { GroupSelector } from "./GroupSelector"

export type Role = "contributor" | "captain"

interface GroupFormProps {
	exerciseId: string
	groups: ST["exercise"]["groups"]
	backHref: string
}

export const GroupForm = ({ exerciseId, groups, backHref }: GroupFormProps) => {
	const router = useRouter()
	const formRef = React.useRef<HTMLFormElement>(null)

	const [group, setGroup] = React.useState<string | null>(null)

	const handleGroupChange = () => {
		if (formRef.current) {
			formRef.current.requestSubmit()
			router.push(backHref)
		}
	}

	return (
		<form action={submitGroupAction} ref={formRef}>
			<input type="hidden" value={exerciseId} name="exerciseId" />

			<div className={cx(group && "hidden")}>
				<GroupSelector groups={groups} setGroup={setGroup} />
			</div>
			<div className={cx(!group && "hidden")}>
				<GroupRoleSelector onGroupChange={handleGroupChange} />
			</div>
		</form>
	)
}
