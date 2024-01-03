"use server"

import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import type { BrainstormPresenterAnswers } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"

const columnsSchema = z.record(
	z.string(),
	z.array(
		z.object({
			id: z.string(),
			response: z.string(),
		}),
	),
)

const submitBoardSchema = zfd.formData({
	columns: zfd.json(columnsSchema),
	exerciseSlug: zfd.text(),
})

export async function submitBoardAction(formData: FormData) {
	const data = submitBoardSchema.parse(formData)

	const exercise = await client.findExerciseBySlug(data.exerciseSlug)

	if (!exercise) return new NextResponse("No Exercise Found", { status: 404 })

	const exerciseAnswers = exercise?.answers ?? []

	let presenterColumns: BrainstormPresenterAnswers["answers"] = {}

	if (exerciseAnswers.length > 0) {
		Object.assign(presenterColumns, ...exerciseAnswers)
	}

	for (const key in data.columns) {
		Object.assign(presenterColumns, {
			[key]: data.columns[key].map((card) => card.id),
		})
	}

	await sanity.patch(exercise._id).set({ answers: presenterColumns }).commit()

	revalidatePath("/presenter/[code]/[slug]", "page")
}
