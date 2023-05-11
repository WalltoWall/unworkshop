import { Dumbbell, ListOrdered } from "lucide-react"
import { s } from "sanity-typed-schema-builder"

export const Exercise = s.document({
	name: "exercise",
	title: "Exercises",
	icon: () => <Dumbbell width={24} height={24} />,
	preview: {
		// TODO: Uppercase subtitle
		select: { title: "name", subtitle: "type" },
	},

	fields: [
		{
			name: "name",
			title: "Name",
			description: "The name of this exercise.",
			type: s.string(),
		},
		{
			name: "slug",
			title: "Slug",
			description: "Determines the URL of the exercise page.",
			type: s.slug({ options: { source: "name" } }),
		},
		{
			name: "type",
			title: "Type",
			description: "The type of exercise that this is.",
			type: s.string({
				initialValue: "brainstorm",
				options: {
					list: [
						{ title: "Brainstorm", value: "brainstorm" },
						{ title: "Sliders", value: "sliders" },
						{ title: "Quadrants", value: "quadrants" },
						{ title: "Form", value: "form" },
					],
				},
			}),
		},

		// Brainstorm fields.
		{
			name: "steps",
			title: "Steps",
			description: "The steps of this brainstorm exercise.",
			optional: true,
			type: s.array({
				initialValue: [],
				hidden: ({ document }) => document?.type !== "brainstorm",
				of: [
					s.object({
						icon: () => <ListOrdered width={24} height={24} />,
						preview: {
							select: { title: "prompt", subtitle: "helpText" },
						},
						fields: [
							{
								name: "prompt",
								title: "Prompt",
								description:
									"The main set of instructions for this step of the brainstorm.",
								type: s.text({ rows: 3 }),
							},
							{
								name: "helpText",
								title: "Help Text",
								description:
									"Small additional help text shown below the prompt.",
								type: s.string({
									initialValue: "Single or short word responses are preferred.",
								}),
							},
						],
					}),
				],
			}),
		},

		// Slider fields.

		// Quadrant fields.

		// Form fields.
	],
})
export type Exercise = Omit<s.infer<typeof Exercise>, "type"> & {
	type: "brainstorm" | "sliders" | "quadrants" | "form"
}
