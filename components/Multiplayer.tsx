import React from "react"
import throttle from "just-throttle"
import { useUsers } from "y-presence"
import { WebsocketProvider } from "y-websocket"
import { Cursor } from "./Cursor"

interface MultiplayerProps {
	role?: string
	awareness: WebsocketProvider["awareness"]
	cursors?: boolean
}

const Cursors = ({ awareness, cursors = false, role }: MultiplayerProps) => {
	const users = useUsers(awareness)

	// When the user moves their pointer, update their presence
	const handlePointMove = React.useCallback(
		throttle((e: PointerEvent) => {
			awareness.setLocalStateField("point", [e.clientX, e.clientY])

			if (role === "contributor") {
				awareness.setLocalStateField("hidden", true)
			}
		}, 80),
		[],
	)

	React.useEffect(() => {
		window.addEventListener("pointermove", handlePointMove)

		return () => {
			window.removeEventListener("pointermove", handlePointMove)
		}
	}, [])

	return cursors ? (
		<div>
			{Array.from(users.entries()).map(([key, value]) => {
				if (key === awareness.clientID || value.hidden) return null

				return (
					<Cursor
						key={key}
						color={value.color}
						name={value.name}
						point={value.point}
					/>
				)
			})}
		</div>
	) : null
}

const Multiplayer = (props: MultiplayerProps) => {
	return props.awareness ? (
		<div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full">
			<Cursors {...props} />
		</div>
	) : null
}

export default Multiplayer
