import React from "react"
import ReactDOM from "react-dom"
import throttle from "just-throttle"
import { Cursor } from "./Cursor"
import { type MultiplayerData } from "./use-multiplayer"

export const Cursors = ({
	awareness,
	users,
}: Pick<MultiplayerData, "awareness" | "users">) => {
	React.useEffect(() => {
		const handleMove = throttle((e: PointerEvent) => {
			awareness.setLocalStateField("point", [e.clientX, e.clientY])
		}, 25)

		window.addEventListener("pointermove", handleMove, { passive: true })

		return () => window.removeEventListener("pointermove", handleMove)
	}, [awareness])

	return ReactDOM.createPortal(
		Array.from(users.entries()).map(([id, user]) => {
			if (id === awareness.clientID) return null

			return <Cursor key={id} color={user.color} point={user.point} />
		}),
		document.body,
	)
}

export default Cursors
