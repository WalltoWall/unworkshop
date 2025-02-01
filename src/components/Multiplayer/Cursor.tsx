import * as React from "react"
import { PerfectCursor } from "perfect-cursors"

export function usePerfectCursor(
	cb: (point: number[]) => void,
	point?: number[],
) {
	const [pc] = React.useState(() => new PerfectCursor(cb))

	React.useLayoutEffect(() => {
		if (point) pc.addPoint(point)
		return () => pc.dispose()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pc])

	const onPointChange = React.useCallback(
		(point: number[]) => pc.addPoint(point),
		[pc],
	)

	return onPointChange
}

export const Cursor = React.memo(
	({ point, color }: { point?: number[]; color?: string }) => {
		const rCursor = React.useRef<SVGSVGElement>(null)

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
			<svg
				ref={rCursor}
				viewBox="0 0 30.5 30.5"
				className="absolute -left-4 -top-4 h-6 w-6"
			>
				<path
					fill={color}
					fillRule="nonzero"
					stroke="#FFF"
					strokeWidth="1.5"
					d="m19.47 17.718 8.649-3.145a2.478 2.478 0 0 0 .023-4.649L4.098.908a2.478 2.478 0 0 0-3.19 3.19l9.016 24.044a2.456 2.456 0 0 0 2.32 1.608h.013a2.457 2.457 0 0 0 2.316-1.631l3.145-8.648 1.753-1.753Z"
				/>
			</svg>
		)
	},
)
Cursor.displayName = "Cursor"
