import { parseAsStringLiteral, useQueryState } from "nuqs"

const variants = [
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
] as const

export type Variant = (typeof variants)[number]

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

export function style(v: Variant, b: Brightness) {
	return {
		"--color-presenter": `var(--color-${v}-${b})`,
	} as React.CSSProperties
}

export function useActive() {
	return useQueryState(
		"color",
		parseAsStringLiteral(variants).withDefault("amber"),
	)
}
