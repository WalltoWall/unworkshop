import { User } from "lucide-react"
import { s } from "sanity-typed-schema-builder"
import { Kickoff } from "./Kickoff"

export const Participant = s.document({
	name: "participant",
	title: "Participants",
	icon: () => <User width={24} height={24} />,
	preview: {
		select: { name: "name", kickoff: "kickoff.title" },
		prepare(select) {
			const { name, kickoff } = select as { kickoff: string; name: string }

			return {
				title: name,
				subtitle: kickoff,
			}
		},
	},

	fields: [
		{
			name: "name",
			title: "Name",
			description: "The name of this participant.",
			type: s.string(),
		},
		{
			name: "kickoff",
			title: "Kickoff",
			description: "The kickoff that this participant is in.",
			type: s.reference({ to: [Kickoff], weak: true }),
		},
		{
			name: "onboarded",
			title: "Onboarded?",
			description:
				"Has this participant seen the on-boarding process previously.",
			type: s.boolean({ initialValue: false }),
		},
	],
})
export type Participant = s.infer<typeof Participant>
