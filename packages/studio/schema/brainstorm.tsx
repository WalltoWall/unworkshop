import { defineArrayMember, defineField } from "sanity"
import { FootprintsIcon, StickyNoteIcon } from "lucide-react"
import { pluralize } from "@unworkshop/app/src/lib/pluralize"
import { sharedExerciseFields } from "./fields/shared-exercise-fields"
import { defineBasicPortableTextField } from "./fields/basic-portable-text"
import { toPlainText } from "@portabletext/react"

export const brainstorm = defineField({
	name: "brainstorm",
	type: "object",
	icon: StickyNoteIcon,
	preview: {
		select: { name: "name", steps: "steps" },
		prepare: (s) => ({
			title: `${s.name} - (Brainstorm)`,
			subtitle: pluralize`${s.steps?.length ?? 0} step[|s].`,
		}),
	},
	fields: [
		...sharedExerciseFields,
		defineField({
			name: "steps",
			description:
				"Each item within this list represents a step in the exercise. Each step contains a prompt to answer and options to customize the sticky note.",
			type: "array",
			validation: (r) => r.required(),
			of: [
				defineArrayMember({
					name: "step",
					type: "object",
					icon: FootprintsIcon,
					preview: {
						select: { prompt: "prompt", helpText: "helpText", color: "color" },
						prepare: (s) => {
							return {
								title: s.prompt ? toPlainText(s.prompt) : "Step",
								subtitle: s.helpText,
								media: () => (
									<div
										style={{
											background: s.color?.value || "none",
											width: "calc(100% - 6px)",
											height: "calc(100% - 6px)",
											borderRadius: 1,
										}}
									/>
								),
							}
						},
					},
					fields: [
						defineBasicPortableTextField({
							name: "prompt",
							description: "Top-level prompt for this step.",
							validation: (r) => r.required(),
						}),
						defineField({
							name: "helpText",
							type: "string",
							initialValue: "Single or short word responses are preferred.",
							description: "Small additional text shown below the prompt.",
							validation: (r) => r.required(),
						}),
						defineField({
							name: "placeholder",
							description: "Placeholder text shown in each sticky note.",
							type: "string",
							initialValue: "Type something here to add your perception",
						}),
						defineField({
							name: "color",
							type: "simplerColor",
							description: "The color scheme for the sticky note.",
							initialValue: "#4ade80",
							validation: (r) => r.required(),
						}),
					],
				}),
			],
		}),
	],
})
