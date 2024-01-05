"use server"

import { revalidatePath } from "next/cache"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"

const submitBoardSchema = zfd.formData({
	columnId: zfd.text(),
})

export async function submitBoardAction(formData: FormData) {
	const data = submitBoardSchema.parse(formData)
}
