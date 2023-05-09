"use client"

import { Loader2 } from "lucide-react"
// import { experimental_useFormStatus as useFormStatus } from "react-dom"
import { Arrow } from "@/components/icons/Arrow"

export const RegisterInput = () => {
	// BUG: This currently errors. Replace when stable.
	// const status = useFormStatus()

	const status = { pending: false }

	return (
		<div className="relative mt-6 flex w-full items-center rounded-md bg-black/10 px-3 ring-black ring-offset-4 ring-offset-white focus-within:ring-2">
			<input
				type="text"
				placeholder="Add your first & last name here"
				className="h-12 w-full bg-transparent outline-none leading-none placeholder:text-black/60"
				name="name"
				autoComplete="name"
				disabled={status.pending}
			/>

			<button className="w-4 shrink-0" disabled={status.pending}>
				{status.pending ? (
					<Loader2 className="w-full animate-spin" />
				) : (
					<Arrow />
				)}
			</button>
		</div>
	)
}
