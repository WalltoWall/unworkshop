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

/**
 * Gets a sanitized list of off-limit words from a list of string respones.
 *
 * @param responses The list of responses.
 */
export function getOffLimitWords(responses: string[]): string[] {
	return responses.map(sanitizeString).flatMap((str) => str.split(" "))
}
