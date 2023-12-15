import React from "react"

type Timer = ReturnType<typeof setTimeout>

export function useDebounce(formRefCurrent: HTMLFormElement, delay = 3000) {
	const timer = React.useRef<Timer>()

	React.useEffect(() => {
		return () => {
			if (!timer.current) return
			clearTimeout(timer.current)
		}
	}, [])

	const debouncedFunction = () => {
		const newTimer = setTimeout(() => {
			formRefCurrent.requestSubmit()
		}, delay)
		clearTimeout(timer.current)
		timer.current = newTimer
	}

	return debouncedFunction
}
