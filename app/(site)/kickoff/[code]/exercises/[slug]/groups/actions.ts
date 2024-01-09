"use server"

import { revalidatePath } from "next/cache"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import type { GroupParticipant } from "./types"

const submitGroupSchema = zfd.formData({
	exerciseId: zfd.text(),
	group: zfd.text(),
	role: zfd.text(),
})

export async function submitGroupAction(formData: FormData) {
	const data = submitGroupSchema.parse(formData)

	const participant = await client.findParticipantOrThrow<GroupParticipant>()

	const answers = participant.answers?.[data.exerciseId]?.answers ?? []

	const newGroups: GroupParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta: {
				type: "group",
				group: data.group,
				role: data.role,
			},
			answers,
		},
	}

	await sanity.patch(participant._id).set({ answers: newGroups }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
