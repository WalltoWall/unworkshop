import { Modal } from "@/components/modal"
import { Participant } from "@/participant"
import { text } from "@/styles/text"

export const ParticipantGreeting = () => {
	const participant = Participant.useInfo()
	if (!participant) return null

	function askToRegister() {
		Modal.open({
			title: "Not you?",
			description: "Press the confirm button to re-register under a new name.",
			onConfirm: () => {
				Participant.clear()
				Modal.close()
			},
		})
	}

	return (
		<div className={text({ class: "mr-auto ml-4", style: "copy", size: 16 })}>
			<span>Hi, </span>
			<button
				onClick={askToRegister}
				className="underline hover:text-emerald-600"
			>
				{participant.name}
			</button>
		</div>
	)
}
