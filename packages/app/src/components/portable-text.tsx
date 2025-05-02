import React from "react"
import {
	mergeComponents,
	PortableText as SanityPortableText,
	type PortableTextProps,
	type PortableTextReactComponents,
} from "@portabletext/react"
import { Colors } from "@/colors"

const noop = () => null

const defaultComponents: PortableTextReactComponents = {
	list: {},
	marks: {
		underline: (props) => <span className="underline">{props.children}</span>,
		"strike-through": (props) => (
			<span className="line-through">{props.children}</span>
		),
		textColor: ({ children, value }) => (
			<span
				style={Colors.style(Colors.Variant.parse(value.label.toLowerCase()))}
				className="text-presenter"
			>
				{children}
			</span>
		),
		highlightColor: ({ children, value }) => (
			<span
				style={Colors.style(Colors.Variant.parse(value.label.toLowerCase()))}
				className="text-presenter"
			>
				{children}
			</span>
		),
	},

	types: {},
	block: {
		normal: (props) => (
			<p className="whitespace-pre-line text-16 leading-[1.4]">
				{props.children}
			</p>
		),
	},
	listItem: (props) => <li>{props.children}</li>,

	hardBreak: false,
	unknownMark: noop,
	unknownType: noop,
	unknownBlockStyle: noop,
	unknownList: noop,
	unknownListItem: noop,
}

export type PortableTextComponents = PortableTextProps["components"]

interface Props extends React.ComponentPropsWithoutRef<"div"> {
	value?: PortableTextProps["value"]
	components?: PortableTextComponents
}

export const PortableText = React.memo(
	({ className, value, components, ...props }: Props) => {
		const resolvedComponents = components
			? mergeComponents(defaultComponents, components)
			: defaultComponents

		return (
			<div className={className} {...props}>
				{value && (
					<SanityPortableText value={value} components={resolvedComponents} />
				)}
			</div>
		)
	},
)
PortableText.displayName = "PortableText"
