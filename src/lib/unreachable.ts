export function unreachable(_x: never): never {
	throw new Error("Unreachable!")
}
