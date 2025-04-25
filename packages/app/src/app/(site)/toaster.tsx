"use client"

import { usePathname } from "next/navigation"
import { Toaster as Sonner } from "sonner"

export const Toaster = () => {
	const pathname = usePathname()

	return (
		<Sonner
			richColors
			theme={pathname.includes("kickoff") ? "light" : "dark"}
		/>
	)
}
