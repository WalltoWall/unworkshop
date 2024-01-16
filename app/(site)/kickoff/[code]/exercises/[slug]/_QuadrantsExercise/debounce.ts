import React from "react"
import type { Answer } from "./types"

type Timer = ReturnType<typeof setTimeout>
export type QuadrantData = {
	answer: {
		slug: string
		newAnswer: Answer
	}
	exerciseId: string
	isGroup: boolean
}
export function useDebounce(
	callback: (data: QuadrantData) => void,
	delay = 250,
) {
	const timer = React.useRef<Timer>()

	React.useEffect(() => {
		return () => {
			if (!timer.current) return
			clearTimeout(timer.current)
		}
	}, [])

	const debouncedFunction = (data: QuadrantData) => {
		const newTimer = setTimeout(() => {
			callback(data)
		}, delay)
		clearTimeout(timer.current)
		timer.current = newTimer
	}

	return debouncedFunction
}
