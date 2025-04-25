"use client"

import { PencilIcon, UndoIcon } from "lucide-react"
import { cx } from "class-variance-authority"
import { slugify } from "@/lib/slugify"
import { useExerciseParams } from "@/lib/use-exercise-params"
import { Participant } from "@/participant"

type Props = {
	groups: string[]
	className?: string
}

export const RoleHeader = (props: Props) => {
	const participant = Participant.useInfoOrThrow()
	const params = useExerciseParams()
	const role = participant.role ?? "contributor"

	const group = props.groups.find((g) => slugify(g) === params.group)
	if (!group) return null

	return (
		<button
			className={cx(
				props.className,
				"relative -mx-7 flex items-center justify-center gap-2 bg-neutral-500 py-3 pr-10 pl-4 text-white transition hover:bg-neutral-600",
			)}
			onClick={() => Participant.setRole(null)}
		>
			<PencilIcon className="size-4" />
			<span className="mb-0.5">
				You are a <strong>{role}</strong> in <strong>{group}</strong>.
			</span>

			<UndoIcon className="absolute right-4 size-4" />
		</button>
	)
}
