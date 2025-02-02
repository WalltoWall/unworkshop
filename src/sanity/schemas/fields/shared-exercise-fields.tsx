import { defineArrayMember, defineField } from "sanity"

export const sharedExerciseFields = [
	defineField({
		name: "name",
		type: "string",
		validation: (r) => r.required(),
	}),
	defineField({
		name: "illustration",
		type: "string",
		initialValue: "speechBubbles",
		options: {
			list: [
				{ title: "Speech Bubbles", value: "speechBubbles" },
				{ title: "Rolling Boards", value: "rollingBoards" },
				{ title: "Clocks & Hands", value: "clocksAndHands" },
				{ title: "See Saw", value: "seeSaw" },
				{ title: "Us vs. Them", value: "usVsThem" },
				{ title: "Target Audience (A)", value: "targetAudienceA" },
				{ title: "Target Audience (B)", value: "targetAudienceB" },
			],
		},
		validation: (r) => r.required(),
	}),
	defineField({
		name: "groups",
		description:
			"If at least two groups are specified, this exercise will turn into a group exercise.",
		type: "array",
		options: { layout: "tags" },
		validation: (r) =>
			r.custom((v) => {
				if (!v || v.length === 0) return true
				if (v.length < 2) return "Must have at least 2 groups."

				return true
			}),
		of: [defineArrayMember({ type: "string" })],
	}),
]
