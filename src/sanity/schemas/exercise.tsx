// import {
// 	LayoutGridIcon,
// 	ListOrderedIcon,
// 	RemoveFormattingIcon,
// } from "lucide-react"
// import { defineArrayMember, defineField } from "sanity"
// import { pluralize } from "@/lib/pluralize"
// import { formFieldMember } from "@/sanity/schemas/fields/formField"
// import { altText } from "./fields/altText"

// const formFields = [
// 	defineField({
// 		name: "form",
// 		title: "Form",
// 		description: "The configuration for this exercise.",
// 		type: "object",
// 		hidden: ({ document }) => document?.type !== "form",
//
// 		fields: [
// 			defineField({
// 				name: "steps",
// 				title: "Steps",
// 				description:
// 					"Each item in this section represents a step in this exercise.",
// 				type: "array",
// 				initialValue: [],
// 				of: [
// 					defineArrayMember({
// 						name: "step",
// 						title: "Step",
// 						type: "object",
// 						icon: () => <RemoveFormattingIcon width={24} height={24} />,
//
// 						preview: {
// 							select: {
// 								fields: "fields",
// 							},
// 							prepare(select) {
// 								return {
// 									title: "Step",
// 									subtitle: pluralize`${select.fields.length} field[|s].`,
// 								}
// 							},
// 						},
//
// 						fields: [
// 							defineField({
// 								name: "fields",
// 								title: "Fields",
// 								description: "Specify the form fields to use for this step.",
// 								type: "array",
// 								initialValue: [],
// 								of: [formFieldMember],
// 							}),
// 						],
// 					}),
// 				],
// 			}),
// 		],
// 	}),
// ]
//
// const brainstormFields = [
// 	defineField({
// 		name: "steps",
// 		title: "Steps",
// 		description: "The steps of this brainstorm exercise.",
// 		type: "array",
//
// 		initialValue: [],
// 		hidden: ({ document }) => document?.type !== "brainstorm",
// 		of: [
// 			defineArrayMember({
// 				type: "object",
// 				icon: () => <ListOrderedIcon width={24} height={24} />,
//
// 				preview: {
// 					select: { title: "prompt", subtitle: "helpText" },
// 				},
//
// 				fields: [
// 					defineField({
// 						name: "prompt",
// 						title: "Prompt",
// 						description:
// 							"The main set of instructions for this step of the brainstorm.",
// 						type: "text",
// 						rows: 3,
// 					}),
// 					defineField({
// 						name: "helpText",
// 						title: "Help Text",
// 						description: "Small additional help text shown below the prompt.",
// 						type: "string",
// 						initialValue: "Single or short word responses are preferred.",
// 					}),
// 					defineField({
// 						name: "placeholder",
// 						title: "Placeholder",
// 						description: "Placeholder text shown in each sticky note.",
// 						type: "string",
// 						initialValue: "Type something here to add your perception",
// 					}),
// 					defineField({
// 						name: "color",
// 						title: "Color",
// 						type: "string",
// 						description:
// 							"Choose what color post it note you want for each step of the brainstorm.",
// 						initialValue: "green",
// 						options: {
// 							list: [
// 								{ title: "Green", value: "green" },
// 								{ title: "Red", value: "red" },
// 								{ title: "Yellow", value: "yellow" },
// 							],
// 						},
// 					}),
// 				],
// 			}),
// 		],
// 	}),
// ]
//
// const quadrantFields = [
// 	defineField({
// 		name: "today_instructions",
// 		title: "Today Instructions",
// 		description: "Instructions on how to do this exercise",
// 		type: "array",
//
// 		of: [
// 			defineArrayMember({
// 				type: "block",
// 				styles: [],
// 				lists: [],
// 				marks: {
// 					decorators: [{ title: "Bold", value: "strong" as const }],
// 					annotations: [],
// 				},
// 			}),
// 		],
// 		hidden: ({ document }) => document?.type !== "quadrants",
// 	}),
// 	defineField({
// 		name: "tomorrow_instructions",
// 		title: "Tomorrow Instructions",
// 		description: "Instructions on how to do this exercise",
// 		type: "array",
// 		of: [
// 			defineArrayMember({
// 				type: "block",
// 				styles: [],
// 				lists: [],
// 				marks: {
// 					decorators: [{ title: "Bold", value: "strong" as const }],
// 					annotations: [],
// 				},
// 			}),
// 		],
// 		hidden: ({ document }) => document?.type !== "quadrants",
// 	}),
// 	defineField({
// 		name: "finalize_instructions",
// 		title: "Finalize Instructions",
// 		description: "Instructions on how to finalize your answers.",
// 		type: "array",
//
// 		of: [
// 			defineArrayMember({
// 				type: "block",
// 				styles: [],
// 				lists: [],
// 				marks: {
// 					decorators: [{ title: "Bold", value: "strong" as const }],
// 					annotations: [],
// 				},
// 			}),
// 		],
// 		hidden: ({ document }) => document?.type !== "quadrants",
// 	}),
// 	defineField({
// 		name: "quadrants",
// 		title: "Quadrants",
// 		description: "The group of quadrant selectors for this exercise.",
// 		type: "array",
//
// 		initialValue: [],
// 		hidden: ({ document }) => document?.type !== "quadrants",
// 		of: [
// 			defineArrayMember({
// 				type: "object",
// 				icon: () => <LayoutGridIcon width={24} height={24} />,
// 				preview: {
// 					select: { title: "name" },
// 				},
// 				fields: [
// 					defineField({
// 						name: "name",
// 						title: "Name",
// 						description: "The name of this quadrant exercise",
// 						type: "string",
// 						validation: (Rule) => Rule.required(),
// 					}),
// 					defineField({
// 						name: "slug",
// 						title: "Slug",
// 						description: "Determines the URL of the quadrant.",
// 						type: "slug",
// 						options: {
// 							source: (_, opts) => (opts.parent as any)?.name,
// 						},
// 						validation: (Rule) => Rule.required(),
// 					}),
// 					defineField({
// 						name: "topValue",
// 						title: "Top Value",
// 						description: "The value at the top of the Y axis",
// 						type: "string",
// 						validation: (Rule) => Rule.required(),
// 					}),
// 					defineField({
// 						name: "bottomValue",
// 						title: "Bottom Value",
// 						description: "The value at the bottom of the Y axis",
// 						type: "string",
// 						validation: (Rule) => Rule.required(),
// 					}),
// 					defineField({
// 						name: "leftValue",
// 						title: "Left Value",
// 						description: "The value at the left of the X axis",
// 						type: "string",
// 						validation: (Rule) => Rule.required(),
// 					}),
// 					defineField({
// 						name: "rightValue",
// 						title: "Right Value",
// 						description: "The value at the right of the X axis",
// 						type: "string",
// 						validation: (Rule) => Rule.required(),
// 					}),
// 					defineField({
// 						title: "Top-Left Image",
// 						name: "topLeftImage",
// 						type: "image",
// 						fields: [altText],
// 					}),
// 					defineField({
// 						title: "Top-Right Image",
// 						name: "topRightImage",
// 						type: "image",
// 						fields: [altText],
// 					}),
// 					defineField({
// 						title: "Bottom-Left Image",
// 						name: "bottomLeftImage",
// 						type: "image",
// 						fields: [altText],
// 					}),
// 					defineField({
// 						title: "Bottom-Right Image",
// 						name: "bottomRightImage",
// 						type: "image",
// 						fields: [altText],
// 					}),
// 				],
// 			}),
// 		],
// 	}),
// ]
