type ReorderArgs<T> = {
	list: Array<T>
	startIdx: number
	endIdx: number
}

/**
 * Function that *mutates* the provided `list` and swaps the items at the
 * provided `startIdx` and `endIdx`.
 *
 * @returns void
 */
export const swap = <T>({ list, startIdx, endIdx }: ReorderArgs<T>) => {
	const [removed] = list.splice(startIdx, 1)
	list.splice(endIdx, 0, removed)
}

type MoveArgs<T> = {
	from: { list: Array<T>; idx: number }
	to: { list: Array<T>; idx: number }
}

/**
 * Function that *mutates* the provided `list` in `from` and `to` and swaps the
 * items at the provided `idx` values.
 *
 * @returns void
 */
export const move = <T>({ from, to }: MoveArgs<T>) => {
	const [removed] = from.list.splice(from.idx, 1)

	to.list.splice(to.idx, 0, removed)
}
