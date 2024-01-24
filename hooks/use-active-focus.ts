import React from "react"

export function useActiveFocus() {
	const [activeElement, setActiveElement] = React.useState(
		() => window?.document?.activeElement,
	)

	React.useEffect(() => {
		window.addEventListener(
			"focus",
			() => setActiveElement(window?.document?.activeElement),
			true,
		)
		window.addEventListener("blur", () => setActiveElement(null), true)

		return () => {
			window.removeEventListener(
				"focus",
				() => setActiveElement(window?.document?.activeElement),
				true,
			)
			window.removeEventListener("blur", () => setActiveElement(null), true)
		}
	}, [])

	return activeElement
}
