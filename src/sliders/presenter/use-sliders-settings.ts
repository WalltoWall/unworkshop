import { useStore } from "@nanostores/react"
import { atom } from "nanostores"

type Settings = {
	view: "dots" | "bars"
	showToday: boolean
	showTomorrow: boolean
}

export const $settings = atom<Settings>({
	view: "dots",
	showToday: true,
	showTomorrow: true,
})

export const useSettings = () => useStore($settings)
