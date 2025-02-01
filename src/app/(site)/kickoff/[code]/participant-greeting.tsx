"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Modal } from "@/components/modal"
import { useKickoffParams } from "@/lib/use-kickoff-params"
import { Participant } from "@/participant"
import { text } from "@/styles/text"

export const ParticipantGreeting = () => {
	const participant = Participant.useInfo({ withRedirect: false })
	const router = useRouter()
	const params = useKickoffParams()
	const pathname = usePathname()

	const kickoffHref = `/kickoff/${params.code}/register`
	const onRegisterPage = pathname.endsWith("/register")

	React.useEffect(() => router.prefetch(kickoffHref), [router, kickoffHref])

	if (!participant || onRegisterPage) return null

	function askToRegister() {
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
				{participant.name}
			</button>
		</div>
	)
}
