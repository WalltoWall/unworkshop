import { parseAsInteger, useQueryState } from "nuqs"

export function useStep() {
	return useQueryState("step", parseAsInteger.withDefault(1))
}
