import { useStore } from "@nanostores/react"
import React from "react"
import { useParams, useRouter } from "next/navigation"
import { persistentAtom } from "@nanostores/persistent"
import { nanoid } from "nanoid"
import { z } from "zod"

const KEY = "unworkshop-participant"

const $participant = persistentAtom<Info | null>(KEY, null, {
	encode: JSON.stringify,
	decode: (val) => {
		try {
			return Info.parse(JSON.parse(val))
		} catch {
			return null
		}
	},
})
const Info = z.object({ name: z.string(), id: z.string() })
export type Info = { name: string; id: string }

type Args = { withRedirect?: boolean }
const DEFAULT_ARGS: Args = { withRedirect: true }

export function useInfo({ withRedirect = true }: Args = DEFAULT_ARGS) {
	const router = useRouter()
	const p = useStore($participant)
	const params = useParams<{ code: string }>()

	React.useEffect(() => {
		if (p || !params.code || !withRedirect) return

		router.push(`/kickoff/${params.code}/register`)
	}, [p, params.code, router, withRedirect])

	return p
}

export function useInfoOrThrow() {
	const participant = useInfo()
	if (!participant) throw new Error("No participant found, but is required.")

	return participant
}

export function create(name: string) {
	$participant.set({ name, id: nanoid(6) })
}

export function clear() {
	$participant.set(null)
}
