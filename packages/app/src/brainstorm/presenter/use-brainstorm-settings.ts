import { useSearch } from "@tanstack/react-router"
import z from "zod"

export namespace BranstormSettings {
	export const fallback = { sorter: "visible" } as const

	export const Schema = z.object({
		sorter: z.literal(["visible", "hidden"]).default(fallback.sorter),
	})
	export type Schema = z.infer<typeof Schema>

	export function useStore(): Schema {
		return useSearch({
			from: "/_authenticated/presenter_/$code/$exerciseSlug",
			select: (s) => s.brainstorm,
		})
	}
}
