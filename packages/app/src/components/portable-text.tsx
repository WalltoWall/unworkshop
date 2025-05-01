import React from "react"
import {
	mergeComponents,
	PortableText as SanityPortableText,
	type PortableTextProps,
	type PortableTextReactComponents,
} from "@portabletext/react"

const noop = () => null

const defaultComponents: PortableTextReactComponents = {
	list: {},
	marks: {
		underline: (props) => <span className="underline">{props.children}</span>,
		"strike-through": (props) => (
			<span className="line-through">{props.children}</span>
		),
	},

	types: {},
	block: {
		normal: (props) => <p className="whitespace-pre-line">{props.children}</p>,
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
