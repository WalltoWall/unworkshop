import type { Card, Columns } from "./BrainstormPresenterViewClient"

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
	newColumn?: Columns
	cards?: Array<Card>
	changeIndex?: string
	columnTitle?: string
}

export const determineColumnState = (
	state: Columns,
	action: ColumnsDispatch,
) => {
	switch (action.type) {
		case "Update Color":
			if (!action.columnId || !action.color) break
			state[action.columnId].color = action.color
			return state
		case "Update Title":
			if (!action.columnId || !action.columnTitle) break
			state[action.columnId].title = action.columnTitle
			return state
		case "Delete Column":
			if (!action.columnId) break
			state = Object.fromEntries(
				Object.entries(state).filter(([key]) => key !== action.columnId),
			)
			return state
		case "Create Column":
			if (!action.newColumn) break
			state[action.columnId!] = action.newColumn[action.columnId!]
			return state
		case "Update Columns":
			if (!action.newColumn) break
			return action.newColumn
		case "Update Cards":
			if (!action.cards || !action.changeIndex) break
			state[action.changeIndex].cards = action.cards
			return state
		default:
			throw new Error("Invalid action received: " + action.type)
	}
	throw new Error("Invalid action received: " + action.type)
}
