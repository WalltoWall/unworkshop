/**
 * Returns a random integer between the provided `min` and `max`.
 *
 * @param min Minimum value of the random value.
 * @param max Maximum value of the random value.
 *
 * @returns The random value.
 */
export function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
