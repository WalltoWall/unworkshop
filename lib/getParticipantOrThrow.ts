import { cookies } from "next/headers"
import { z } from "zod"
import { client } from "@/sanity/client"
import { PARTICIPANT_COOKIE } from "@/constants"

export async function getParticipantOrThrow() {
	const participantId = z
		.string()
		.parse(cookies().get(PARTICIPANT_COOKIE)?.value)

	const participant = await client.findParticipant(participantId)
	if (!participant) throw new Error("No onboarded participant found.")

	return participant
}
