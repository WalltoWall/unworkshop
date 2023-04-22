"use client"

import { zfd } from "zod-form-data"
import { useRouter } from "next/navigation"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"

const FormSchema = zfd.formData({ code: zfd.text() })

export const ExerciseCodeForm = () => {
	const router = useRouter()

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const data = FormSchema.parse(new FormData(e.currentTarget))

		router.push(`/kickoff/${data.code}`)
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
					className="h-[72px] rounded-2xl bg-gray-75 p-4 text-center font-heading text-56 uppercase leading-heading text-black outline-none ring-gray-82 ring-offset-2 ring-offset-black placeholder:text-gray-38 focus:ring-1"
					placeholder="WTW-1234"
				/>

				<Button>Continue</Button>
			</form>
		</div>
	)
}
