"use client"

import { cx } from "class-variance-authority"
import { Colors } from "@/colors"
import { text } from "@/styles/text"

type RootProps = {
	className?: string
	children: React.ReactNode
}
const Root = (props: RootProps) => {
	const [color] = Colors.useActive()

	return (
		<div
			style={Colors.style(color, 300)}
			className={cx(props.className, "rounded-2xl bg-black px-5 py-4")}
		>
			{props.children}
		</div>
	)
}
Root.displayName = "Legend.Root"

type HeadingProps = {
	className?: string
	children: React.ReactNode
}
const Heading = (props: HeadingProps) => {
	return (
		<p className={text({ class: props.className, size: 24, style: "heading" })}>
			{props.children}
		</p>
	)
}
Heading.displayName = "Legend.Heading"

export const Legend = {
	Root,
	Heading,
}
