import type { Colors } from "@/colors"

export namespace BrainstormPresenterS {
	export type Column = {
		id: string
		title: string
		color: Colors.Variant
		stickies: string[]
	}

	export type Step = {
		columns: Column[]
		buckets?: number
	}

	export type Shape = {
		steps: Record<number, Step>
	}
}
