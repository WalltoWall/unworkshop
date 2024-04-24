import { defineField } from "sanity"

export const altText = defineField({
	name: "alt",
	title: "Alt Text",
	type: "string",
	description:
		"Textual representation or summary of the content that is within the image. Aides visually-impaired visitors with understanding the context or meaning of the image. If this image is purely decorative, feel free to omit this field.",
})
