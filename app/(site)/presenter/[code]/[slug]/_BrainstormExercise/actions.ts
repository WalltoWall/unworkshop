"use server"

import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import type { BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"

const columnsSchema = z.record(
	z.string(),
	z.object({
		color: z.string(),
		title: z.string(),
		cards: z.array(
			z.object({
				id: z.string(),
				response: z.string(),
			}),
		),
	}),
)

const submitBoardSchema = zfd.formData({
	columns: zfd.json(columnsSchema),
	exerciseSlug: zfd.text(),
})

export async function submitBoardAction(formData: FormData) {
	const data = submitBoardSchema.parse(formData)

	const exercise = await client.findExerciseBySlug(data.exerciseSlug)

	if (!exercise) return new NextResponse("No Exercise Found", { status: 404 })

	let presenterColumns: BrainstormExercise["answers"] = {}

	for (const key in data.columns) {
		Object.assign(presenterColumns, {
			[key]: {
				color: data.columns[key].color,
				title: data.columns[key].title,
				cards: data.columns[key].cards.map((card) => card.id),
			},
		})
	}

	await sanity.patch(exercise._id).set({ answers: presenterColumns }).commit()

	revalidatePath("/presenter/[code]/[slug]", "page")
}
