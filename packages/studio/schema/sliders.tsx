import { FootprintsIcon, SlidersHorizontalIcon } from "lucide-react"
import { toPlainText } from "@portabletext/react"
import { defineArrayMember, defineField } from "sanity"
import { pluralize } from "@unworkshop/app/src/lib/pluralize"
import { sharedExerciseFields } from "./fields/shared-exercise-fields"
import { defineBasicPortableTextField } from "./fields/basic-portable-text"

export const sliders = defineField({
	name: "sliders",
	type: "object",
	icon: SlidersHorizontalIcon,
	preview: {
		select: { name: "name", steps: "steps" },
		prepare: (s) => ({
			title: `${s.name} - (Sliders)`,
			subtitle: pluralize`${s.steps?.length ?? 0} step[|s].`,
		}),
	},
	fields: [
		...sharedExerciseFields,
		defineField({
			name: "steps",
			description:
				"Each item within this list represents a step in the exercise. Each step can contain up to two sliders.",
			type: "array",
			validation: (r) => r.required(),
			of: [
				defineArrayMember({
					name: "step",
					type: "object",
					icon: FootprintsIcon,
					preview: {
						select: { prompt: "prompt", sliders: "sliders" },
						prepare: (s) => {
							const num = s?.sliders?.length ?? 0
							const title = s.prompt ? toPlainText(s.prompt) : "Step"

							return {
								title,
								subtitle: pluralize`${num} slider[|s].`,
							}
						},
					},
					fields: [
						defineBasicPortableTextField({
							name: "prompt",
							description:
								'Top-level prompt for this step. Usually this just mirrors the values within the sliders, e.g. "Boutique vs. Corporate".',
							validation: (r) => r.required(),
						}),

						defineField({
							name: "sliders",
							type: "array",
							description:
								'Each item within this list represents a slider within this step. Each slider has a "left" and a "right" value. Max 2 sliders per step.',
							of: [
								defineArrayMember({
									name: "slider",
									type: "object",
									icon: SlidersHorizontalIcon,
									validation: (r) => r.required(),
									preview: {
										select: {
											prompt: "prompt",
											left: "left",
											right: "right",
										},
										prepare: (s) => ({
											title: s.prompt ? toPlainText(s.prompt) : "Slider",
											subtitle: `${s.left} vs. ${s.right}`,
										}),
									},
									fields: [
										defineBasicPortableTextField({
											name: "prompt",
											description:
												"Question text for this slider. Supports basic formatting.",
											validation: (r) => r.required(),
										}),
										defineField({
											name: "left",
											description:
												"The value on the left-hand side of the slider.",
											type: "string",
											validation: (r) => r.required(),
										}),
										defineField({
											name: "right",
											description:
												"The value on the right-hand side of the slider.",
											type: "string",
											validation: (r) => r.required(),
										}),
									],
								}),
							],
							validation: (r) => r.required().min(1).max(2),
						}),
					],
				}),
			],
		}),
	],
})
