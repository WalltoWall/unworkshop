import { useStore } from "@nanostores/react"
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
const Info = z.object({
	name: z.string(),
	id: z.string(),
})
export type Info = z.infer<typeof Info>

export function isRegistered() {
	return Boolean($participant.get())
}

type UseInfoArgs = {
	assert?: boolean
}

export function useInfo(args: UseInfoArgs & { assert: true }): Info
export function useInfo(args?: UseInfoArgs): Info | null
export function useInfo(args: UseInfoArgs = {}): Info | null {
	const participant = useStore($participant)
	const { assert = false } = args

	if (assert && !participant) {
		throw new Error("No participant found, but is required.")
	}

	return participant
}

export function create(name: string) {
	$participant.set({ name, id: nanoid(6) })
}

export function clear() {
	$participant.set(null)
}
