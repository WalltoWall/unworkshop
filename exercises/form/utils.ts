import { stripIndent } from "common-tags"
import type {
	FormField,
	FormFieldAnswer,
	ListFieldAnswer,
	NarrowFieldAnswer,
	TaglineFieldAnswer,
} from "./types"

const CLEAN_REGEX = /[^a-zA-Z ]/g

/**
 * Removes all special and non-ascii characters from the provided string.
 *
 * @param str String to sanitize
 */
export function sanitizeString(str: string | undefined | null): string {
	if (!str) return ""

	return str.replace(CLEAN_REGEX, "").toLowerCase().trim()
}

/**
 * Gets a sanitized set of off-limit words from a list of string respones.
 *
 * @param responses The list of responses.
 */
export function getBadWords(responses: string[]): Set<string> {
	return new Set(responses.map(sanitizeString).flatMap((str) => str.split(" ")))
}

type TaglineVariantOption = NonNullable<FormField["color"]>
type TaglineVariant = { invalidTextCn: string; invalidBgCn: string }
const variants: Record<TaglineVariantOption, TaglineVariant> = {
	red: {
		invalidTextCn: "text-red-63",
		invalidBgCn: "bg-red-57",
	},
	green: {
		invalidTextCn: "text-green-52",
		invalidBgCn: "bg-green-52",
	},
	yellow: {
		invalidTextCn: "text-yellow-52",
		invalidBgCn: "bg-yellow-52",
	},
}

export function getTaglineVariant(variant: TaglineVariantOption) {
	return variants[variant]
}

export function assertListAnswer(
	answer: FormFieldAnswer | undefined,
): asserts answer is ListFieldAnswer | undefined {
	if (answer && answer.type !== "List") {
		throw new Error(stripIndent`
			Invalid answer found for this field. 
				Expected: "List"
				Received: "${answer.type}"
		`)
	}
}

export function assertNarrowAnswer(
	answer: FormFieldAnswer | undefined,
): asserts answer is NarrowFieldAnswer | undefined {
	if (answer && answer.type !== "Narrow") {
		throw new Error(stripIndent`
			Invalid answer found for this field. 
				Expected: "Narrow"
				Received: "${answer.type}"
		`)
	}
}

export function assertTaglineAnswer(
	answer: FormFieldAnswer | undefined,
): asserts answer is TaglineFieldAnswer | undefined {
	if (answer && answer.type !== "Tagline") {
		throw new Error(stripIndent`
			Invalid answer found for this field. 
				Expected: "Tagline"
				Received: "${answer.type}"
		`)
	}
}

export function assertListSource(
	source: FormFieldAnswer,
): asserts source is ListFieldAnswer {
	if (source.type !== "List") {
		throw new Error(stripIndent`
			Invalid source found for this field. 
				Expected: "List"
				Received: "${source.type}"
		`)
	}
}