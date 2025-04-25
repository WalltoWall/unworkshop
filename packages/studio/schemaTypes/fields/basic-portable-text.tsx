import {
	defineArrayMember,
	defineField,
	type ArrayRule,
	type FieldDefinition,
	type ValidationBuilder,
} from "sanity"

interface Args
	extends Omit<
		FieldDefinition<"array">,
		"type" | "of" | "options" | "validation"
	> {
	validation?: ValidationBuilder<ArrayRule<unknown[]>, unknown[]> | undefined
}

export const defineBasicPortableTextField = (args: Args) => {
	return defineField({
		...args,
		type: "array",
		of: [
			defineArrayMember({
				type: "block",
				styles: [],
				lists: [],
				marks: {
					decorators: [
						{ title: "Strong", value: "strong" },
						{ title: "Emphasis", value: "em" },
						{ title: "Underline", value: "underline" },
					],
				},
			}),
		],
		initialValue: [],
	})
}

export const portableTextMaxLength =
	(max: number) => (Rule: ArrayRule<unknown[]>) =>
		Rule.custom((b = []) => {
			const blocks = b as any[]

			const totalCharacters = blocks
				.filter((block) => block._type === "block")
				.reduce(
					(acc, block) =>
						acc +
						block.children
							.filter((child: any) => child._type === "span")
							.reduce(
								(sum: number, span: any) =>
									sum + (span.text ? span.text.length : 0),
								0,
							),
					0,
				)

			if (totalCharacters > max) {
				return `Content exceeds maximum length of ${max} characters. Current length: ${totalCharacters}`
			}

			return true
		})
