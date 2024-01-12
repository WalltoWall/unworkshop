import { WebrtcProvider } from "y-webrtc"
import * as Y from "yjs"
import { USER_COLORS } from "@/constants"

export function useMultiplayer(room: string) {
	const doc = new Y.Doc()
	const provider = new WebrtcProvider(room, doc, {
		password: "this-the-thing-in-here",
		maxConns: 10,
		filterBcConns: false,
	})

	const awareness = provider.awareness
	const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
	awareness.setLocalStateField("color", color)

	return awareness
}
