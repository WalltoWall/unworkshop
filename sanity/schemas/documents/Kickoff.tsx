import { Warehouse } from "lucide-react"
import type { Slug } from "sanity"
import { s } from "sanity-typed-schema-builder"

export const Kickoff = s.document({
	name: "kickoff",
	title: "Kickoff",
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
		{
			name: "title",
			title: "Title",
			description:
				"The name of this kickoff. Will be shown to attendees on the site.",
			type: s.string(),
		},
		{
			name: "code",
			title: "Code",
			description:
				"The project code for this kickoff. Will be used as the URL.",
			type: s.slug({
				validation: (rule) =>
					rule.custom((val) => {
						if (val?.current?.toLowerCase() !== val?.current)
							return "Code must be lowercase."

						return true
					}),
			}),
		},
	],
})
export type Kickoff = s.infer<typeof Kickoff>
