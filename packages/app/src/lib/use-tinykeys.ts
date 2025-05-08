import React from "react"
import { tinykeys, type KeyBindingMap } from "./tinykeys"

export function useTinykeys(map: KeyBindingMap) {
	React.useEffect(() => tinykeys(window, map), [map])
}
