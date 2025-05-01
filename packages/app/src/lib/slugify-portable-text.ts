import { toPlainText } from "@portabletext/react"
import { slugify } from "./slugify"

type PTValue = Parameters<typeof toPlainText>[0]

export function slugifyPortableText(pt: PTValue) {
	return slugify(toPlainText(pt))
}
