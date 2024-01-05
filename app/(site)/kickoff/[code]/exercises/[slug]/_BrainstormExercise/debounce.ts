import React from "react"

type Timer = ReturnType<typeof setTimeout>

export function useDebounce(callback: (e?: any) => void, delay = 250) {
	const timer = React.useRef<Timer>()

	React.useEffect(() => {
		return () => {
			if (!timer.current) return
			clearTimeout(timer.current)
		}
	}, [])

	const debouncedFunction = () => {
		const newTimer = setTimeout(() => {
			callback()
		}, delay)
		clearTimeout(timer.current)
		timer.current = newTimer
	}

	return debouncedFunction
}
