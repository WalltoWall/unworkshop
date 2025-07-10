import type { Colors } from "@/colors"

export namespace BrainstormPresenterS {
	export type Column = {
		title: string
		color: Colors.Variant
		stickies: string[]
	}
	export type State = {
		state: { columns: Column[]; buckets: number }
	}
}
