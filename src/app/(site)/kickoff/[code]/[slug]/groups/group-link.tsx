"use client"

import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { slugify } from "@/lib/slugify"
import { Participant } from "@/participant"
import { text } from "@/styles/text"

type Props = { code: string; slug: string; group: string }

export const GroupLink = (props: Props) => {
	return (
		<li>
			<Link
				href={`/kickoff/${props.code}/${props.slug}/groups/${slugify(props.group)}`}
				className="hover:bg-brand focus:bg-brand flex items-center justify-between rounded-lg bg-neutral-200 px-3 pt-3.5 pb-4 leading-none transition"
				onClick={() => Participant.setRole(null)}
			>
				<p className={text({ size: 32, style: "heading" })}>{props.group}</p>
				<ArrowRightIcon className="mt-1 size-5" strokeWidth={3} />
			</Link>
		</li>
	)
}
