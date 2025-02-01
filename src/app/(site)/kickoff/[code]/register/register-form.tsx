"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Text } from "@/components/Text"
import { Participant } from "@/participant"
import { RegisterInput } from "./register-input"

export const RegisterForm = (props: { kickoffCode: string }) => {
	const router = useRouter()

	const kickoffHref = `/kickoff/${props.kickoffCode}`

	function action(data: FormData) {
		const name = z.string().parse(data.get("name"))
		Participant.create(name)
		router.push(kickoffHref)
	}

	// Preload the main kickoff page.
	React.useEffect(() => router.prefetch(kickoffHref), [kickoffHref, router])

	return (
		<form
			className="flex flex-col items-center gap-3 text-center"
			action={action}
		>
			<Text style="heading" size={24} asChild className="text-green-40">
				<h2>Let's get started</h2>
			</Text>

			<RegisterInput />

			<Text style="copy" size={12} className="text-gray-50">
				Don't worry, your answers will be anonymous.
			</Text>
		</form>
	)
}
