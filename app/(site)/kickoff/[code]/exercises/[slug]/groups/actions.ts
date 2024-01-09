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

	const newGroups: GroupParticipant["groups"] = {
		...participant.groups,
		[data.exerciseId]: {
			group: data.group,
			role: data.role,
		},
	}

	await sanity.patch(participant._id).set({ groups: newGroups }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
