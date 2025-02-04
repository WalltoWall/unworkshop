import { parseAsStringLiteral, useQueryState } from "nuqs"

const views = ["dots", "bars"] as const

export type View = (typeof views)[number]

export function useView() {
	return useQueryState("view", parseAsStringLiteral(views).withDefault("dots"))
}
