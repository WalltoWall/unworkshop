"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Modal } from "@/components/modal"
import { useKickoffParams } from "@/lib/use-kickoff-params"
import { Participant } from "@/participant"
import { text } from "@/styles/text"

export const ParticipantGreeting = () => {
	const router = useRouter()
	const params = useKickoffParams()

	const pathname = usePathname()
	const onRegisterPage = pathname.endsWith("/register")

	const participant = Participant.useInfo({ withRedirect: !onRegisterPage })

	if (onRegisterPage) return null

	function askToRegister() {
		const kickoffHref = `/kickoff/${params.code}/register`
		router.prefetch(kickoffHref)

		Modal.open({
			title: "Not you?",
			description: "Press the confirm button to re-register under a new name.",
			onConfirm: () => {
				router.push(kickoffHref)
				Participant.clear()
				Modal.close()
			},
		})
	}

	return (
		<div className={text({ class: "mr-auto ml-4", style: "copy", size: 16 })}>
			<span>Hi, </span>
			<button onClick={askToRegister} className="underline">
				{participant?.name}
			</button>
		</div>
	)
}
