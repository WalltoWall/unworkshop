const CLEAN_REGEX = /[^a-zA-Z ]/g

/**
 * Removes all special and non-ascii characters from the provided string.
 *
 * @param str String to sanitize
 */
export function sanitizeString(str: string | undefined | null): string {
	if (!str) return ""

	return str.replace(CLEAN_REGEX, "").toLowerCase()
}

/**
 * Gets a sanitized set of off-limit words from a list of string respones.
 *
 * @param responses The list of responses.
 */
export function getBadWords(responses: string[]): Set<string> {
	return new Set(responses.map(sanitizeString).flatMap((str) => str.split(" ")))
}
