import { useSearch } from "@tanstack/react-router"
import { z } from "zod"

export const Variant = z.literal([
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
])
export const variants = Array.from(Variant.values)

export type Variant = z.infer<typeof Variant>

const vars: Record<Variant, string> = {
	red: "var(--color-red-400)",
	orange: "var(--color-orange-400)",
	amber: "var(--color-amber-400)",
	yellow: "var(--color-yellow-400)",
	lime: "var(--color-lime-400)",
	green: "var(--color-green-400)",
	emerald: "var(--color-emerald-400)",
	teal: "var(--color-teal-400)",
	cyan: "var(--color-cyan-400)",
	sky: "var(--color-sky-400)",
	blue: "var(--color-blue-400)",
	indigo: "var(--color-indigo-400)",
	violet: "var(--color-violet-400)",
	purple: "var(--color-purple-400)",
	fuchsia: "var(--color-fuchsia-400)",
	pink: "var(--color-pink-400)",
	rose: "var(--color-rose-400)",
}

export type Brightness =
	| 50
	| 100
	| 200
	| 300
	| 400
	| 500
	| 600
	| 700
	| 800
	| 900
	| 950

export function style(v: Variant) {
	return { "--color-presenter": vars[v] } as React.CSSProperties
}

export function useActive() {
	const search = useSearch({
		from: "/_authenticated/presenter_/$code/$exerciseSlug",
	})

	return search.color
}

export const fallback: Variant = "amber"
