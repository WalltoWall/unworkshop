import React from "react"
import { usePathname } from "next/navigation"

type Props = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	ref: React.RefObject<HTMLDialogElement | null>
}

export function useDialog({ open, setOpen, ref }: Props) {
	const pathname = usePathname()

	// Whenever the URL path changes, close the dialog.
	React.useEffect(() => ref.current?.close(), [pathname, ref])

	// Sync close events, e.g. keyboard ESC with the dialog.
	React.useEffect(() => {
		const dialog = ref.current
		if (!dialog) return

		const syncCloseState = () => setOpen(false)
		dialog.addEventListener("close", syncCloseState)

		return () => dialog.removeEventListener("close", syncCloseState)
	}, [setOpen, ref])

	// When the dialog is open, close it if someone clicks outside the active area.
	React.useEffect(() => {
		if (!open) return

		const closeIfOutsideClick = (e: Event) => {
			const target = e.target as HTMLElement
			if (ref.current?.contains(target)) return

			ref.current?.close()
			document.removeEventListener("click", closeIfOutsideClick)
		}

		document.addEventListener("click", closeIfOutsideClick)

		return () => document.removeEventListener("click", closeIfOutsideClick)
	}, [open, ref])

	React.useEffect(() => {
		if (open) ref.current?.showModal()
		else ref.current?.close()
	}, [open, ref])
}
