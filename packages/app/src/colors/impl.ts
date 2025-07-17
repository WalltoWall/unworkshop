import { useSearch } from "@tanstack/react-router"
import { randomInteger } from "remeda"
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

const bgs: Record<Variant, string> = {
	red: "var(--color-red-200)",
	orange: "var(--color-orange-200)",
	amber: "var(--color-amber-200)",
	yellow: "var(--color-yellow-200)",
	lime: "var(--color-lime-200)",
	green: "var(--color-green-200)",
	emerald: "var(--color-emerald-200)",
	teal: "var(--color-teal-200)",
	cyan: "var(--color-cyan-200)",
	sky: "var(--color-sky-200)",
	blue: "var(--color-blue-200)",
	indigo: "var(--color-indigo-200)",
	violet: "var(--color-violet-200)",
	purple: "var(--color-purple-200)",
	fuchsia: "var(--color-fuchsia-200)",
	pink: "var(--color-pink-200)",
	rose: "var(--color-rose-200)",
}

const borders: Record<Variant, string> = {
	red: "var(--color-red-300)",
	orange: "var(--color-orange-300)",
	amber: "var(--color-amber-300)",
	yellow: "var(--color-yellow-300)",
	lime: "var(--color-lime-300)",
	green: "var(--color-green-300)",
	emerald: "var(--color-emerald-300)",
	teal: "var(--color-teal-300)",
	cyan: "var(--color-cyan-300)",
	sky: "var(--color-sky-300)",
	blue: "var(--color-blue-300)",
	indigo: "var(--color-indigo-300)",
	violet: "var(--color-violet-300)",
	purple: "var(--color-purple-300)",
	fuchsia: "var(--color-fuchsia-300)",
	pink: "var(--color-pink-300)",
	rose: "var(--color-rose-300)",
}

const colors: Record<Variant, string> = {
	red: "var(--color-red-800)",
	orange: "var(--color-orange-800)",
	amber: "var(--color-amber-800)",
	yellow: "var(--color-yellow-800)",
	lime: "var(--color-lime-800)",
	green: "var(--color-green-800)",
	emerald: "var(--color-emerald-800)",
	teal: "var(--color-teal-800)",
	cyan: "var(--color-cyan-800)",
	sky: "var(--color-sky-800)",
	blue: "var(--color-blue-800)",
	indigo: "var(--color-indigo-800)",
	violet: "var(--color-violet-800)",
	purple: "var(--color-purple-800)",
	fuchsia: "var(--color-fuchsia-800)",
	pink: "var(--color-pink-800)",
	rose: "var(--color-rose-800)",
}

const stickyVars = {
	colors,
	bgs,
	borders,
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

export function stickyStyle(v: Variant) {
	return {
		backgroundColor: stickyVars.bgs[v],
		color: stickyVars.colors[v],
		borderColor: stickyVars.borders[v],
	}
}

export function random() {
	return variants[randomInteger(0, variants.length - 1)] || fallback
}
