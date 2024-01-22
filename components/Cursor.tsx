import * as React from "react"
import { usePerfectCursor } from "@/hooks/use-perfect-cursor"
import { CursorIcon } from "./icons/CursorIcon"

export const Cursor = React.memo(
	({
		point,
		color,
		name,
	}: {
		point?: number[]
		color?: string
		name?: string
	}) => {
		const rCursor = React.useRef<HTMLDivElement>(null)

		const animateCursor = React.useCallback((point: number[]) => {
			const elm = rCursor.current
			if (!elm) return
			elm.style.setProperty(
				"transform",
				`translate(${point[0]}px, ${point[1]}px)`,
			)
		}, [])

		const onPointMove = usePerfectCursor(animateCursor)

		// Update the point whenever the component updates
		if (point) {
			onPointMove(point)
		}

		if (!point || !color) return null

		return (
			<div
				ref={rCursor}
				className="absolute -left-[4px] -top-[6px] z-50 h-[35px] w-[35px]"
				style={{
					color,
				}}
			>
				<CursorIcon />
				<span
					className="absolute left-[calc(100%-0.5rem)] top-6 whitespace-nowrap rounded p-1 text-white text-14 capsize"
					style={{
						backgroundColor: color,
					}}
				>
					{name}
				</span>
			</div>
		)
	},
)

Cursor.displayName = "Cursor"
