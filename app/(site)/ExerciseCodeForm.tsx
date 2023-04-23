"use client"

import * as React from "react"
import { zfd } from "zod-form-data"
import { useRouter } from "next/navigation"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { cx } from "class-variance-authority"

const FormSchema = zfd.formData({ code: zfd.text() })

export const ExerciseCodeForm = () => {
	const router = useRouter()
	const [error, setError] = React.useState("")

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const res = FormSchema.safeParse(new FormData(e.currentTarget))
		if (!res.success) return setError("Please try again.")

		router.push(`/kickoff/${res.data.code}`)
	}

	return (
		<div className="space-y-4 px-7 pb-20 text-center">
			<Text style="heading" size={24}>
				Enter your group code
			</Text>

			<form className="flex flex-col space-y-1.5" onSubmit={handleSubmit}>
				<input
					type="text"
					name="code"
					className={cx(
						error && "ring-1 ring-red-63",
						"h-[72px] rounded-2xl bg-gray-75 p-4 text-center font-heading text-56 uppercase leading-heading text-black outline-none ring-gray-82 ring-offset-2 ring-offset-black placeholder:text-gray-38 focus:ring-1",
					)}
					placeholder="WTW-1234"
					required
				/>

				<Button>Continue</Button>
			</form>
		</div>
	)
}
