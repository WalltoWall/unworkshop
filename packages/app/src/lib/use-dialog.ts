import { router } from "@/router"
import React from "react"

type Props = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	ref: React.RefObject<HTMLDialogElement | null>
}

export function useDialog({ open, setOpen, ref }: Props) {
	// Close after any history change
	React.useEffect(() => router.subscribe("onLoad", () => ref.current?.close()))

	// Sync close events, e.g. keyboard ESC with the dialog.
	React.useEffect(() => {
		const dialog = ref.current
		if (!dialog) return

		const syncCloseState = () => setOpen(false)
		dialog.addEventListener("close", syncCloseState)

		return () => dialog.removeEventListener("close", syncCloseState)
	}, [setOpen, ref])

	React.useEffect(() => {
		if (!ref.current) return
		const dialog = ref.current

		if (!open) return dialog.close()

		dialog.showModal()

		const closeIfOutsideClick = (e: MouseEvent) => {
			const rect = dialog.getBoundingClientRect()
			const isInDialog =
				rect.top <= e.clientY &&
				e.clientY <= rect.top + rect.height &&
				rect.left <= e.clientX &&
				e.clientX <= rect.left + rect.width

			if (isInDialog) return

			dialog.close()
			document.removeEventListener("click", closeIfOutsideClick)
		}

		// The initial click that opens the dialog fires an event, so only add the
		// listener after the next tick.
		setTimeout(() => document.addEventListener("click", closeIfOutsideClick), 0)

		return () => document.removeEventListener("click", closeIfOutsideClick)
	}, [open, ref])
}
