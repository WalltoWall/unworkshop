import { s } from "sanity-typed-schema-builder"

export const altText = {
	name: "alt",
	title: "Alt Text",
	description: `
        Textual representation or summary of the content that is within the
        image. Aides visually-impaired visitors with understanding the context
        or meaning of the image. If this image is purely decorative, feel free
        to omit this field.
    `,
	optional: true,
	type: s.string(),
}
