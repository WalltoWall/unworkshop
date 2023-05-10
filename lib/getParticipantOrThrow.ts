import { PARTICIPANT_COOKIE } from "@/constants"
import { findParticipant } from "@/sanity/client"
import { cookies } from "next/headers"
import { z } from "zod"

export async function getParticipantOrThrow() {
	const participantId = z
		.string()
		.parse(cookies().get(PARTICIPANT_COOKIE)?.value)

	const participant = await findParticipant(participantId)
	if (!participant) throw new Error("No onboarded participant found.")

	return participant
}
