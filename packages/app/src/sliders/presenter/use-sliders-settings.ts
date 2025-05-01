import { useSearch } from "@tanstack/react-router"
import z from "zod"

export namespace SlidersSettings {
	export const fallback = { show: "both", view: "bars" } as const

	export const Schema = z.object({
		view: z.literal(["dots", "bars"]).default(fallback.view),
		show: z.literal(["today", "tomorrow", "both"]).default(fallback.show),
	})
	export type Schema = z.infer<typeof Schema>

	export function useStore(): Schema {
		return useSearch({
			from: "/_authenticated/presenter_/$code/$exerciseSlug",
			select: (s) => s.sliders,
		})
	}
}
