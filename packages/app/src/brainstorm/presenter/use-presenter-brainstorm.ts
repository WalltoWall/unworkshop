import { nanoid } from "nanoid"
import React from "react"
import { clone } from "remeda"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { DEFAULT_BUCKETS } from "./constants"
import type { BrainstormPresenterS } from "./schemas"
import type { BrainstormS } from "../schemas"

export type BrainstormPresenter = ReturnType<typeof usePresenterBrainstorm>

export function usePresenterBrainstorm() {
	const socket = useUnworkshopSocket<BrainstormPresenterS.Shape>({
		type: "presenter",
		shape: { columns: [], meta: {} },
	})

	const state = socket.state
	const actions = React.useMemo(
		() => ({
			addBucket: () => {
				state.meta.buckets = (state.meta.buckets ?? DEFAULT_BUCKETS) + 1
			},
			deleteBucket: () => {
				state.meta.buckets = (state.meta.buckets ?? DEFAULT_BUCKETS) - 1
			},

			assignSticky: (args: {
				columnId: BrainstormPresenterS.Column["id"]
				stickyId: BrainstormS.Sticky["id"]
			}) => {
				const col = state.columns.find((col) => col.id === args.columnId)
				if (!col) return

				col.stickies.push(args.stickyId)
			},

			addColumn: (args: Pick<BrainstormPresenterS.Column, "color">) => {
				state.columns.push({
					color: args.color,
					stickies: [],
					title: "",
					id: nanoid(6),
				})
			},
			deleteColumn: (args: Pick<BrainstormPresenterS.Column, "id">) => {
				const idx = state.columns.findIndex((col) => col.id === args.id)
				if (idx === -1) return

				state.columns.splice(idx, 1)
			},
			updateColumns: (newColumns: BrainstormPresenterS.Column[]) => {
				state.columns.splice(0, state.columns.length, ...clone(newColumns))
			},

			updateColumnTitle: (
				args: Pick<BrainstormPresenterS.Column, "title" | "id">,
			) => {
				const col = state.columns.find((col) => col.id === args.id)
				if (!col) return

				col.title = args.title
			},
			updateColumnColor: (
				args: Pick<BrainstormPresenterS.Column, "color" | "id">,
			) => {
				const col = state.columns.find((col) => col.id === args.id)
				if (!col) return

				col.color = args.color
			},
		}),
		[state],
	)

	return {
		connecting: socket.connecting,
		state,
		actions,
	}
}
