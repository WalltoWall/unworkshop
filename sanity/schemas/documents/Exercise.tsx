import { Dumbbell, ListOrdered } from "lucide-react"
import { s } from "sanity-typed-schema-builder"

export const Exercise = s.document({
	name: "exercise",
	title: "Exercises",
	icon: () => <Dumbbell width={24} height={24} />,
	preview: {
		select: { name: "name" },
		prepare(select) {
			const { name } = select as { name: string }

			return {
				title: name,
			}
		},
	},

	fields: [
		{
			name: "name",
			title: "Name",
			description: "The name of this exercise.",
			type: s.string(),
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
			type: s.array({
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
export type Exercise = s.infer<typeof Exercise>
