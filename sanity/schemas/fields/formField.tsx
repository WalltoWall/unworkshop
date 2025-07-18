import { FormInput } from "lucide-react"
import { defineArrayMember, defineField } from "sanity"

export const formFieldMember = defineArrayMember({
	type: "object",
	icon: () => <FormInput width={24} height={24} />,
	preview: {
		select: {
			title: "prompt",
			subtitle: "additionalText",
		},
	},
	description: "The configuration for this form field.",
	fields: [
		defineField({
			name: "type",
			title: "Type",
			description: "The type of field input to use.",
			type: "string",
			initialValue: "List",
			options: {
				list: ["List", "Narrow", "Text", "Big Text", "Tagline"],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "prompt",
			title: "Prompt",
			description:
				"The prompt that is shown above the form field. Supports basic markdown syntax.",
			type: "text",
			rows: 6,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "additionalText",
			title: "Additional Text",
			description:
				"Supplementary text that is shown below the prompt in a smaller font size.",
			type: "text",
			rows: 3,
		}),

		// Shared fields.
		defineField({
			name: "source",
			title: "Source",
			description:
				"Designate this field to prompt its inputs based on the answer of another step and field.",
			type: "object",
			options: { collapsed: true, collapsible: true },
			fields: [
				defineField({
					name: "step",
					title: "Step",
					description: "Specify the step to pull from.",
					type: "number",
					validation: (rule) => rule.required().positive(),
				}),
				defineField({
					name: "field",
					title: "Field",
					description: "Specify the field of the step to pull from.",
					type: "number",
					validation: (rule) => rule.required().positive(),
				}),
				defineField({
					name: "answer",
					title: "Answer",
					description:
						'Specify the answer to pull. Only applicable when sourcing from "Narrow" fields into "Text" or "Big Text" fields.',
					type: "number",
					validation: (rule) => rule.positive(),
				}),
			],
		}),
		defineField({
			name: "placeholder",
			title: "Placeholder",
			description:
				"The placeholder text shown in inputs before a participant enters a value.",
			type: "string",
			hidden: ({ parent }) => parent?.type === "Narrow",
		}),

		// List fields.
		defineField({
			name: "rows",
			title: "Rows",
			description:
				"Specify the number of response rows to show by default. Default 5.",
			type: "number",
			initialValue: 5,
			hidden: ({ parent }) => parent?.type !== "List",
		}),
		defineField({
			name: "showAddButton",
			title: "Show add button?",
			description:
				"If checked, show the add button at the bottom of the input to allow participants to add more responses.",
			type: "boolean",
			initialValue: false,
			options: { layout: "checkbox" },
			hidden: ({ parent }) => parent?.type !== "List",
		}),
		defineField({
			name: "addButtonText",
			title: "Add button text",
			description:
				'The text shown inside the add button. Defaults to "Add another".',
			type: "string",
			initialValue: "Add another",
			hidden: ({ parent }) => parent?.type !== "List" || !parent?.showAddButton,
		}),

		// Narrow fields.
		defineField({
			name: "min",
			title: "Minimum",
			description: "Specify the minimum number of choices to narrow to.",
			type: "number",
			hidden: ({ parent }) => parent?.type !== "Narrow",
			validation: (rule) => rule.positive(),
		}),
		defineField({
			name: "max",
			title: "Maximum",
			description: "Specify the maximum number of choices to narrow to.",
			type: "number",
			hidden: ({ parent }) => parent?.type !== "Narrow",
			validation: (rule) => rule.positive(),
		}),

		// Tagline fields.
		defineField({
			name: "color",
			title: "Color",
			description: "Select the color scheme for this tagline.",
			type: "string",
			initialValue: "red",
			hidden: ({ parent }) => parent?.type !== "Tagline",
			options: {
				list: [
					{ title: "Red", value: "red" },
					{ title: "Green", value: "green" },
					{ title: "Yellow", value: "yellow" },
				],
			},
		}),
		defineField({
			name: "allowMultiple",
			title: "Allow Multiple Responses?",
			description: "If checked, participants can add an additional responses.",
			type: "boolean",
			initialValue: true,
			hidden: ({ parent }) => parent?.type !== "Tagline",
			options: { layout: "checkbox" },
		}),
		defineField({
			name: "responseCount",
			title: "Response Count",
			description: "Maximum amount of responses if multiple are allowed.",
			type: "number",
			initialValue: 2,
			hidden: ({ parent }) => {
				return parent?.type !== "Tagline" || parent?.allowMultiple !== true
			},
			validation: (r) => r.greaterThan(1),
		}),
	],
})
