import { Warehouse } from "lucide-react"
import { defineArrayMember, defineField, defineType } from "@sanity-typed/types"
import { type Slug } from "sanity"

export const Kickoff = defineType({
	name: "kickoff",
	title: "Kickoff",
	type: "document",
	icon: () => <Warehouse width={24} height={24} />,

	preview: {
		select: { code: "code", title: "title" },
		prepare(select) {
			const { code, title } = select as { code?: Slug; title: string }

			return {
				title,
				subtitle: `/kickoff/${code?.current}`,
			}
		},
	},

	fields: [
		defineField({
			name: "title",
			title: "Title",
			description:
				"The name of this kickoff. Will be shown to attendees on the site.",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "code",
			title: "Code",
			description:
				'The project code for this kickoff. Will be used as the URL. Must be in the format of "abc-1234".',
			type: "slug",
			validation: (Rule) => [
				Rule.required(),
				Rule.custom((val) => {
					if (val?.current?.toLowerCase() !== val?.current)
						return "Code must be lowercase."

					if (val?.current.length !== 8)
						return "Code must be 8 characters in length."

					if (val.current.at(3) !== "-")
						return "The 3rd character in a code must be a hyphen (-)."

					return true
				}),
			],
		}),
		defineField({
			name: "exercises",
			title: "Exercises",
			description: "The list of exercises.",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "exercise" as const }],
				}),
			],
		}),
	],
})
