import { Dumbbell, LayoutGrid, ListOrdered } from "lucide-react"
import { defineArrayMember, defineField, defineType } from "@sanity-typed/types"
import { altText } from "../fields/altText"

export const Exercise = defineType({
	name: "exercise",
	type: "document",
	title: "Exercises",
	icon: () => <Dumbbell width={24} height={24} />,

	preview: {
		select: { title: "name", subtitle: "type" },
	},

	fields: [
		defineField({
			name: "name",
			title: "Name",
			description: "The name of this exercise.",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			description: "Determines the URL of the exercise page.",
			type: "slug",
			options: { source: "name" },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "type",
			title: "Type",
			description: "The type of exercise that this is.",
			type: "string",
			initialValue: "brainstorm",
			options: {
				list: [
					{ title: "Brainstorm", value: "brainstorm" },
					{ title: "Sliders", value: "sliders" },
					{ title: "Quadrants", value: "quadrants" },
					{ title: "Form", value: "form" },
				],
			},
			validation: (Rule) => Rule.required(),
		}),

		// Quadrant Instructions
		defineField({
			name: "today_instructions",
			title: "Today Instructions",
			description: "Instructions on how to do this exercise",
			type: "array",

			of: [
				defineArrayMember({
					type: "block",
					styles: [],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" }],
						annotations: [],
					},
				}),
			],
			hidden: ({ document }) => document?.type !== "quadrants",
		}),
		defineField({
			name: "tomorrow_instructions",
			title: "Tomorrow Instructions",
			description: "Instructions on how to do this exercise",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" }],
						annotations: [],
					},
				}),
			],
			hidden: ({ document }) => document?.type !== "quadrants",
		}),
		defineField({
			name: "finalize_instructions",
			title: "Finalize Instructions",
			description: "Instructions on how to finalize your answers.",
			type: "array",

			of: [
				defineArrayMember({
					type: "block",
					styles: [],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" }],
						annotations: [],
					},
				}),
			],
			hidden: ({ document }) => document?.type !== "quadrants",
		}),

		// Brainstorm fields.
		defineField({
			name: "steps",
			title: "Steps",
			description: "The steps of this brainstorm exercise.",
			type: "array",

			initialValue: [],
			hidden: ({ document }) => document?.type !== "brainstorm",
			of: [
				defineArrayMember({
					type: "object",
					icon: () => <ListOrdered width={24} height={24} />,

					preview: {
						select: { title: "prompt", subtitle: "helpText" },
					},

					fields: [
						defineField({
							name: "prompt",
							title: "Prompt",
							description:
								"The main set of instructions for this step of the brainstorm.",
							type: "text",
							rows: 3,
						}),
						defineField({
							name: "helpText",
							title: "Help Text",
							description: "Small additional help text shown below the prompt.",
							type: "string",
							initialValue: "Single or short word responses are preferred.",
						}),
					],
				}),
			],
		}),

		// Slider fields.

		// Quadrant fields.
		defineField({
			name: "quadrants",
			title: "Quadrants",
			description: "The group of quadrant selectors for this exercise.",
			type: "array",

			initialValue: [],
			hidden: ({ document }) => document?.type !== "quadrants",
			of: [
				defineArrayMember({
					type: "object",
					icon: () => <LayoutGrid width={24} height={24} />,
					preview: {
						select: { title: "today_instructions" },
					},
					fields: [
						defineField({
							name: "topValue",
							title: "Top Value",
							description: "The value at the top of the Y axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "bottomValue",
							title: "Bottom Value",
							description: "The value at the bottom of the Y axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "leftValue",
							title: "Left Value",
							description: "The value at the left of the X axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "rightValue",
							title: "Right Value",
							description: "The value at the right of the X axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							title: "Top-Left Image",
							name: "topLeftImage",
							type: "image",
							fields: [altText],
						}),
						defineField({
							title: "Top-Right Image",
							name: "topRightImage",
							type: "image",
							fields: [altText],
						}),
						defineField({
							title: "Bottom-Left Image",
							name: "bottomLeftImage",
							type: "image",
							fields: [altText],
						}),
						defineField({
							title: "Bottom-Right Image",
							name: "bottomRightImage",
							type: "image",
							fields: [altText],
						}),
					],
				}),
			],
		}),

		// Form fields.
	],
})
