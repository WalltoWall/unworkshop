import { useStore } from "@nanostores/react"
import { atom, onMount } from "nanostores"

const QUERY = "(min-width: 48rem)"

const $desktop = atom(false)
onMount($desktop, () => {
	const matcher = window.matchMedia(QUERY)
	$desktop.set(matcher.matches)

	const handleChange = (e: MediaQueryListEvent) => $desktop.set(e.matches)
	matcher.addEventListener("change", handleChange)

	return () => matcher.removeEventListener("change", handleChange)
})

export const useIsDesktop = () => useStore($desktop)
