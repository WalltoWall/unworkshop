import React, { useEffect } from "react"
import { WebrtcProvider } from "y-webrtc"
import * as Y from "yjs"
import { USER_COLORS } from "@/constants"

export type MultiplayerOptions = {
	room: string
	name?: string
}

export function useMultiplayer(opts: MultiplayerOptions) {
	let awareness = React.useRef<WebrtcProvider["awareness"] | null>(null)

	useEffect(() => {
		const doc = new Y.Doc()
		const provider = new WebrtcProvider(opts.room, doc, {
			password: "this-the-thing-in-here",
			maxConns: 10,
			filterBcConns: false,
		})

		awareness.current = provider.awareness

		if (opts.name) {
			awareness.current.setLocalStateField("name", opts.name)
		}

		const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
		awareness.current.setLocalStateField("color", color)
	}, [])

	return awareness.current
}
