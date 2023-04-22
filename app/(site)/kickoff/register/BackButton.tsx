"use client"

import { useRouter } from "next/navigation"

export const BackButton = () => {
	const router = useRouter()

	function handleClick() {
		router.back()
	}

	return (
		<button
			onClick={handleClick}
			className="flex h-6 w-6 items-center justify-center rounded outline-none focus:ring-2"
		>
			<svg viewBox="0 0 10 18" fill="none" className="w-2">
				<path
					d="M9 17L1 9L9 1"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	)
}
