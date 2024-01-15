"use client"

import React from "react"
import throttle from "just-throttle"
import { useUsers } from "y-presence"
import { WebrtcProvider } from "y-webrtc"
import { useActiveFocus } from "@/hooks/use-active-element"
import { Cursor } from "./Cursor"

interface MultiplayerProps {
	awareness: WebrtcProvider["awareness"]
	cursors?: boolean
}

const Cursors = ({ awareness, cursors = true }: MultiplayerProps) => {
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

	return cursors ? (
		<div>
			{Array.from(users.entries()).map(([key, value]) => {
				if (key === awareness.clientID) return null
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

const FocusRings = ({ awareness }: MultiplayerProps) => {
	const activeElement = useActiveFocus()
	const users = useUsers(awareness)

	React.useEffect(() => {
		if (activeElement?.tagName !== "BODY") {
			awareness.setLocalStateField("focused", activeElement?.id)
		}
	}, [activeElement])

	return (
		<>
			{Array.from(users.entries()).map(([key, value]) => {
				if (key === awareness.clientID) return null

				if (!value.focused) return null

				const element = document.getElementById(value.focused)

				if (!element) return null

				const rect = element?.getBoundingClientRect()

				return value.focused ? (
					<div
						className="absolute rounded-md outline outline-2"
						key={key}
						style={{
							outlineColor: value.color,
							width: rect.width,
							height: rect.height,
							top: rect?.top,
							left: rect?.left,
						}}
					>
						{value.name && (
							<span
								className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded p-1 text-white text-14 capsize"
								style={{
									backgroundColor: value.color,
								}}
							>
								{value.name}
							</span>
						)}
					</div>
				) : null
			})}
		</>
	)
}

const Multiplayer = (props: MultiplayerProps) => {
	// const activeElement = useActiveFocus()

	// React.useEffect(() => {
	// 	console.log(activeElement)
	// 	// props.awareness.setLocalStateField("focus", activeElement)
	// }, [activeElement])

	return props.awareness ? (
		<div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full">
			<Cursors {...props} />
			<FocusRings {...props} />
		</div>
	) : null
}

export default Multiplayer
