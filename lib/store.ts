import { WebrtcProvider } from "y-webrtc"
import * as Y from "yjs"
import { USER_COLORS } from "@/constants"

const doc = new Y.Doc()
const provider = new WebrtcProvider("wall-to-wall-testing-mp", doc, {
	password: "this-the-thing-in-here",
	maxConns: 10,
	filterBcConns: false,
})

export const awareness = provider.awareness

// A random color for the current user
export const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
awareness.setLocalStateField("color", color)
