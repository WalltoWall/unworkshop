import type * as ST from "@/sanity/types.gen"

export type QuadrantsAnswer = {
	type: "quadrants"
	step: number
	data: Record<string, Array<QuadrantStepAnswer>>
}

export type QuadrantStepAnswer = {
	today?: QuadrantDotPlacement
	tomorrow?: QuadrantDotPlacement
}

export type QuadrantDotPlacement = { top: number; left: number }

export type QuadrantStep = NonNullable<ST.Exercise["quadrants"]>[number]

export type QuadrantStepState =
	| "today_pending"
	| "tomorrow_pending"
	| "complete"
