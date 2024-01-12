"use client"

import React from "react"
import throttle from "just-throttle"
import { useUsers } from "y-presence"
import { WebrtcProvider } from "y-webrtc"
import { Cursor } from "./Cursor"

interface MultiplayerProps {
	awareness: WebrtcProvider["awareness"] | null
}

const Cursors = ({ awareness }: MultiplayerProps) => {
	const users = useUsers(awareness!)

	// When the user moves their pointer, update their presence
	const handlePointMove = React.useCallback(
		throttle((e: PointerEvent) => {
			awareness!.setLocalStateField("point", [e.clientX, e.clientY])
		}, 80),
		[],
	)

	React.useEffect(() => {
		window.addEventListener("pointermove", handlePointMove)

		return () => {
			window.removeEventListener("pointermove", handlePointMove)
		}
	}, [])

	return (
		<div>
			{Array.from(users.entries()).map(([key, value]) => {
				if (key === awareness!.clientID) return null
				return <Cursor key={key} color={value.color} point={value.point} />
			})}
		</div>
	)
}

const Count = ({ awareness }: MultiplayerProps) => {
	const users = useUsers(awareness!)

	return <div className="fixed bottom-5 right-5">Total users: {users.size}</div>
}

const Multiplayer = (props: MultiplayerProps) => {
	return props.awareness ? (
		<div className="pointer-events-none fixed left-0 top-0 h-full w-full">
			<Cursors {...props} />
			<Count {...props} />
		</div>
	) : null
}

export default Multiplayer
