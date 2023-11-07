"use client"

import { useFormStatus } from "react-dom"
import { Arrow } from "@/components/icons/Arrow"
import { Spinner } from "@/components/Spinner"

export const RegisterInput = () => {
	const status = useFormStatus()

	return (
		<div className="relative mt-6 flex w-full items-center rounded-md bg-black/10 px-3 focus-within:outline focus-within:outline-2">
			<input
				type="text"
				placeholder="Add your first & last name here"
				className="h-12 w-full bg-transparent outline-none leading-none placeholder:text-black/60"
				name="name"
				autoComplete="name"
				disabled={status.pending}
			/>

			<button className="w-4 shrink-0" disabled={status.pending}>
				{status.pending ? <Spinner className="animate-spin" /> : <Arrow />}
			</button>
		</div>
	)
}
