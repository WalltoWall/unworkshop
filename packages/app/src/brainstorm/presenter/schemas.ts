import type { Colors } from "@/colors"

export namespace BrainstormPresenterS {
	export type Column = {
		id: string
		title: string
		color: Colors.Variant
		stickies: string[]
	}

	export type Shape = {
		columns: Column[]
		meta: {
			buckets?: number
		}
	}
}
