const CLEAN_REGEX = /[^a-zA-Z ]/g

/**
 * Removes all special and non-ascii characters from the provided string.
 *
 * @param word String to sanitize
 * @returns
 */
export function sanitizeString(word: string | undefined | null): string {
	return word?.replace(CLEAN_REGEX, "").toLowerCase() ?? ""
}
