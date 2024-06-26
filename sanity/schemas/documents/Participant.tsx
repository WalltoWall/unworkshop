import { User } from "lucide-react"
import { defineField, defineType } from "sanity"
import { uid } from "uid"

export const Participant = defineType({
	type: "document",
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
		defineField({
			name: "name",
			title: "Name",
			description: "The name of this participant.",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "recovery_code",
			title: "Recovery Code",
			description:
				"Upon the loss of cookies, this code allows for entering a workshop as an existing user",
			type: "string",
		}),
		defineField({
			name: "kickoff",
			title: "Kickoff",
			description: "The kickoff that this participant is in.",
			type: "reference",
			to: [{ type: "kickoff" as const }],
			weak: true,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "onboarded",
			title: "Onboarded?",
			description:
				"Has this participant seen the on-boarding process previously.",
			type: "boolean",
			initialValue: false,
			validation: (Rule) => Rule.required(),
		}),
	],
})
