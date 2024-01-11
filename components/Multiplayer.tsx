"use client"

import React from "react"
import throttle from "just-throttle"
import { useUsers } from "y-presence"
import { awareness } from "@/lib/store"
import { Cursor } from "./Cursor"

const Cursors = () => {
	const users = useUsers(awareness)

	// When the user moves their pointer, update their presence
	const handlePointMove = React.useCallback(
		throttle((e: PointerEvent) => {
			awareness.setLocalStateField("point", [e.clientX, e.clientY])
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
				if (key === awareness.clientID) return null
				return <Cursor key={key} color={value.color} point={value.point} />
			})}
		</div>
	)
}

const Count = () => {
	const users = useUsers(awareness)

	return <div className="fixed bottom-5 right-5">Total users: {users.size}</div>
}

const Multiplayer = () => {
	return (
		<>
			<Cursors />
			<Count />
		</>
	)
}

export default Multiplayer
