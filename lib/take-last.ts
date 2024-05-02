export const takeLast =
	(num: number) =>
	<T>(arr: T[]) =>
		arr.slice(num * -1)
