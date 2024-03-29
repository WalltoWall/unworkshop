"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { client } from "@/sanity/client"

const CodeSchema = z
	.string()
	.length(7, "Code must be 7 characters in length.")
	.transform((val) => {
		const code = val.toLowerCase()
		return code.slice(0, 3) + "-" + code.slice(3)
	})
	.refine(
		async (val) => {
			const kickoff = await client.findKickoff(val)

			return Boolean(kickoff)
		},
		{ message: "Kickoff does not exist." },
	)

export async function registerForKickoff(
	prevState: { error: string },
	data: FormData,
) {
	"use server"

	const result = await CodeSchema.safeParseAsync(data.get("code"))
	if (!result.success) {
		const msg = result.error.format()._errors.join(";")

		return { error: msg }
	}

	redirect(`/kickoff/${result.data}`)
}
