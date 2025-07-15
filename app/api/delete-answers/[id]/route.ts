import { NextResponse, type NextRequest } from "next/server"
import { env } from "@/env"

async function deletePartykitAnswers(id: string) {
	const url = new URL(
		`/parties/main/exercise::${id}`,
		env.NEXT_PUBLIC_PARTYKIT_HOST,
	)
	const res = await fetch(url, { method: "DELETE" })
	const data = await res.text()

	console.info(data)
}

type Params = Promise<{ id: string }>

export async function POST(_request: NextRequest, ctx: { params: Params }) {
	const params = await ctx.params
	await deletePartykitAnswers(params.id)

	return new NextResponse("Deleted partykit answers.")
}
