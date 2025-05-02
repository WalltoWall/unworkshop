import { WarehouseIcon } from "lucide-react"
import { defineArrayMember, defineField, defineType, type Slug } from "sanity"

export const kickoff = defineType({
	name: "kickoff",
	title: "Kickoff",
	type: "document",
	icon: WarehouseIcon,

	preview: {
		select: { code: "code", title: "title" },
		prepare(s) {
			const { code, title } = s as { code?: Slug; title: string }

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
			validation: (r) => r.required(),
		}),
		defineField({
			name: "code",
			title: "Code",
			description:
				'The project code for this kickoff. Will be used as the URL. Must be in the format of "abc-1234".',
			type: "slug",
			validation: (r) => [
				r.required(),
				r.custom((v) => {
					if (v?.current?.toLowerCase() !== v?.current)
						return "Code must be lowercase."

					if (v?.current && v.current.length !== 8)
						return "Code must be 8 characters in length."

					if (v?.current?.at(3) !== "-")
						return "The 3rd character in a code must be a hyphen (-)."

					return true
				}),
			],
		}),
		defineField({
			name: "greeting",
			title: "Greeting",
			description:
				'The gretting shown to attendees when they register. Should be a short phrase like: "Good morning!"',
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "exercises",
			title: "Exercises",
			description: "The list of exercises for this kickoff.",
			type: "array",
			initialValue: [],
			options: { insertMenu: { showIcons: true, views: [{ name: "grid" }] } },
			of: [
				defineArrayMember({ type: "sliders" }),
				defineArrayMember({ type: "brainstorm" }),
			],
			validation: (r) => r.required(),
		}),
	],
})
