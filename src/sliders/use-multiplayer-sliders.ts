import { useSyncedStore } from "@syncedstore/react"
import { useExerciseParams } from "@/lib/use-exercise-params"
import { useMultiplayer } from "@/lib/use-multiplayer"
import type { SlidersAnswers } from "./types"

export function useMultiplayerSliders(id: string) {
	const params = useExerciseParams()
	const multiplayer = useMultiplayer<SlidersAnswers>({
		slug: params.slug,
		code: params.code,
		id,
	})
	const state = useSyncedStore(multiplayer.store)

	return { state, multiplayer }
}
