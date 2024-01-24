import type { Card, Column, Columns } from "./BrainstormPresenterViewClient"

export const reorder = <T>({
	list,
	startIndex,
	endIndex,
}: {
	list: Array<T>
	startIndex: number
	endIndex: number
}) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result
}

export const move = <T>({
	sourceCards,
	destinationCards,
	sourceIndex,
	destinationIndex,
}: {
	sourceCards: Array<T>
	destinationCards: Array<T>
	sourceIndex: number
	destinationIndex: number
}) => {
	const sourceClone = Array.from(sourceCards)
	const destClone = Array.from(destinationCards)
	const [removed] = sourceClone.splice(sourceIndex, 1)

	destClone.splice(destinationIndex, 0, removed)

	return { fromCards: sourceClone, toCards: destClone }
}

export type ColumnsDispatch = {
	type:
		| "Update Title"
		| "Update Color"
		| "Default"
		| "Delete Column"
		| "Create Column"
		| "Update Columns"
		| "Update Cards"
	color?: string
	columnId?: string
	newColumn?: Column
	replaceColumns?: Columns
	cards?: Array<Card>
	columnTitle?: string
}

export const determineColumnState = (
	state: Columns,
	action: ColumnsDispatch,
) => {
	switch (action.type) {
		case "Update Color":
			if (!action.columnId || !action.color) break
			const col = state.find((column) => column.columnId === action.columnId)
			if (!col) break
			col.color = action.color
			return state
		case "Update Title":
			if (!action.columnId || !action.columnTitle) break
			const column = state.find((column) => column.columnId === action.columnId)
			if (!column) break
			column.title = action.columnTitle
			return state
		case "Delete Column":
			if (!action.columnId) break
			const removedCol = state.find((col) => col.columnId === action.columnId)
			if (!removedCol) break

			const newCards = [...removedCol.cards, ...state[0].cards]

			state[0].cards = newCards

			state = state.filter((column) => column.columnId !== action.columnId)
			return state
		case "Create Column":
			if (!action.newColumn) break
			state.push(action.newColumn)
			return state
		case "Update Columns":
			if (!action.replaceColumns) break
			return action.replaceColumns
		case "Update Cards":
			if (!action.cards || !action.columnId) break
			const cols = state.find((column) => column.columnId === action.columnId)
			if (!cols) break
			cols.cards = action.cards
			return state
		default:
			throw new Error("Invalid action received: " + action.type)
	}
	throw new Error("Invalid action received: " + action.type)
}
