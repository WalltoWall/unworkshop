import { useParams } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import React from "react"
import { clone } from "remeda"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import type { BrainstormS } from "../schemas"
import { useMultiplayerBrainstorm } from "../use-multiplayer-brainstorm"
import { DEFAULT_STEP } from "./constants"
import type { BrainstormPresenterS } from "./schemas"

type Args = {
	stepIdx: number
}

export type BrainstormPresenter = ReturnType<
	typeof usePresenterBrainstorm
>["presenter"]

export function usePresenterBrainstorm(args: Args) {
	const params = useParams({ strict: false })
	const participants = useMultiplayerBrainstorm("presenter")
	const socket = useUnworkshopSocket<BrainstormPresenterS.Shape>({
		type: "presenter",
		shape: { steps: {} },
		room: `${params.code}::${params.exerciseSlug}::presenter`,
	})

	socket.state.steps[args.stepIdx] ??= DEFAULT_STEP
	const state = socket.state.steps[args.stepIdx]

	const actions = React.useMemo(
		() => ({
			addBucket: () => {
				if (!state?.buckets) return

				state.buckets++
			},
			deleteBucket: () => {
				if (!state?.buckets) return

				state.buckets--
			},

			assignSticky: (args: {
				columnId: BrainstormPresenterS.Column["id"]
				stickyId: BrainstormS.Sticky["id"]
			}) => {
				const col = state?.columns.find((col) => col.id === args.columnId)
				if (!col) return

				col.stickies.push(args.stickyId)
			},

			addColumn: (args: Pick<BrainstormPresenterS.Column, "color">) => {
				state?.columns.push({
					color: args.color,
					stickies: [],
					title: "",
					id: nanoid(6),
				})
			},
			deleteColumn: (args: Pick<BrainstormPresenterS.Column, "id">) => {
				if (!state?.columns) return

				const idx = state.columns.findIndex((col) => col.id === args.id)
				if (idx === -1) return

				state.columns.splice(idx, 1)
			},
			updateColumns: (newColumns: BrainstormPresenterS.Column[]) => {
				state?.columns.splice(0, state.columns.length, ...clone(newColumns))
			},

			updateColumnTitle: (
				args: Pick<BrainstormPresenterS.Column, "title" | "id">,
			) => {
				const col = state?.columns.find((col) => col.id === args.id)
				if (!col) return

				col.title = args.title
			},
			updateColumnColor: (
				args: Pick<BrainstormPresenterS.Column, "color" | "id">,
			) => {
				const col = state?.columns.find((col) => col.id === args.id)
				if (!col) return

				col.color = args.color
			},

			deleteSticky: (args: { stickyId: BrainstormS.Sticky["id"] }) => {},
		}),
		[state],
	)

	return {
		presenter: {
			connecting: socket.connecting,
			state,
			actions,
		},
		participants,
	}
}
