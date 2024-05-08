import React from "react"
import {
	mergeComponents,
	PortableText as SanityPortableText,
	type PortableTextComponents,
	type PortableTextProps,
	type PortableTextReactComponents,
} from "next-sanity"
import clsx from "clsx"

const noop = () => null

const defaultComponents: PortableTextReactComponents = {
	list: {
		bullet: (props) => (
			<ul className="grid list-outside list-disc gap-3.5 pl-4 lg:pl-[1.375rem]">
				{props.children}
			</ul>
		),
		number: (props) => (
			<ol
				className={clsx(
					"grid list-outside list-decimal gap-3.5 pl-4 lg:pl-[1.375rem]",
				)}
			>
				{props.children}
			</ol>
		),
	},

	marks: {
		underline: (props) => <span className="underline">{props.children}</span>,
		"strike-through": (props) => (
			<span className="line-through">{props.children}</span>
		),
	},

	types: {},
	block: {},
	listItem: {},

	hardBreak: false,
	unknownMark: noop,
	unknownType: noop,
	unknownBlockStyle: noop,
	unknownList: noop,
	unknownListItem: noop,
}

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
