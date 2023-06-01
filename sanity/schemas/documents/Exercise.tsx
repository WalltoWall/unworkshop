import { Dumbbell, ListOrdered, LayoutGrid } from "lucide-react"
import { s } from "sanity-typed-schema-builder"
import { altText } from "../fields/altText"

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
		{
			name: "quadrants",
			title: "Quadrants",
			description: "The group of quadrant selectors for this exercise.",
			optional: true,
			type: s.array({
				initialValue: [],
				hidden: ({ document }) => document?.type !== "quadrants",
				of: [
					s.object({
						icon: () => <LayoutGrid width={24} height={24} />,
						preview: {
							select: { title: "today_instructions" },
						},
						fields: [
							{
								name: "today_instructions",
								title: "Today Instructions",
								description: "Instructions on how to do this exercise",
								type: s.array({
									of: [
										s.block({
											styles: [],
											lists: [],
											marks: {
												decorators: [{ title: "Bold", value: "strong" }],
												annotations: [],
											},
										}),
									],
								}),
							},
							{
								name: "tomorrow_instructions",
								title: "Tomorrow Instructions",
								description: "Instructions on how to do this exercise",
								type: s.array({
									of: [
										s.block({
											styles: [],
											lists: [],
											marks: {
												decorators: [{ title: "Bold", value: "strong" }],
												annotations: [],
											},
										}),
									],
								}),
							},
							{
								name: "topValue",
								title: "Top Value",
								description: "The value at the top of the Y axis",
								type: s.string(),
							},
							{
								name: "bottomValue",
								title: "Bottom Value",
								description: "The value at the bottom of the Y axis",
								type: s.string(),
							},
							{
								name: "leftValue",
								title: "Left Value",
								description: "The value at the left of the X axis",
								type: s.string(),
							},
							{
								name: "rightValue",
								title: "Right Value",
								description: "The value at the right of the X axis",
								type: s.string(),
							},
							{
								title: "Top-Left Image",
								name: "topLeftImage",
								type: s.image({
									fields: [altText],
								}),
								optional: true,
							},
							{
								title: "Top-Right Image",
								name: "topRightImage",
								type: s.image({
									fields: [altText],
								}),
								optional: true,
							},
							{
								title: "Bottom-Left Image",
								name: "bottomLeftImage",
								type: s.image({
									fields: [altText],
								}),
								optional: true,
							},
							{
								title: "Bottom-Right Image",
								name: "bottomRightImage",
								type: s.image({
									fields: [altText],
								}),
								optional: true,
							},
						],
					}),
				],
			}),
		},

		// Form fields.
	],
})
export type Exercise = Omit<s.infer<typeof Exercise>, "type"> & {
	type: "brainstorm" | "sliders" | "quadrants" | "form"
}
