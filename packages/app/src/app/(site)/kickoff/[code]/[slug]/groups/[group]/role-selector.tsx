"use client"

import Link from "next/link"
import captainIllustration from "@/assets/images/captain-illustration.png"
import contributorIllustration from "@/assets/images/contributerImage.png"
import { slugify } from "@/lib/slugify"
import { useExerciseGroupParams } from "@/lib/use-exercise-params"
import { Participant } from "@/participant"
import { RoleCard } from "./role-card"

type Props = {
	groups: string[]
}

export const RoleSelector = (props: Props) => {
	const params = useExerciseGroupParams()
	const group = props.groups.find((g) => slugify(g) === params.group)

	return (
		<div className="space-y-7">
			<p>
				What's your role? – <strong className="capitalize">{group}</strong> –{" "}
				<Link
					href={`/kickoff/${params.code}/${params.slug}/groups`}
					className="underline"
					onClick={() => Participant.setRole(null)}
				>
					(Wrong group?)
				</Link>
			</p>

			<div className="flex flex-col gap-4">
				<RoleCard
					img={contributorIllustration}
					name="Contributor"
					instructions="I’ll just read along."
					onClick={() => Participant.setRole("contributor")}
				/>
				<RoleCard
					img={captainIllustration}
					name="Captain"
					instructions="I’ll lead and write for my group."
					onClick={() => Participant.setRole("captain")}
				/>
			</div>
		</div>
	)
}
