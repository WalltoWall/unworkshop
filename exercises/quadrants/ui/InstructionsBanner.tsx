import {
	type PortableTextComponents,
	type PortableTextProps,
} from "next-sanity"
import { cx } from "class-variance-authority"
import { PortableText } from "@/components/PortableText"
import { Text } from "@/components/Text"
import { Dot, type DotProps } from "./Dot"

const components: PortableTextComponents = {
	marks: {
		strong: ({ children }) => (
			<strong className="text-indigo-68">{children}</strong>
		),
	},

	block: {
		normal: ({ children }) => (
			<Text style="heading" size={18} asChild>
				<h2>{children}</h2>
			</Text>
		),
	},
}

interface Props {
	value: PortableTextProps["value"]
	className?: string
	dotVariant: DotProps["variant"]
}

export const InstructionsBanner = ({ value, className, dotVariant }: Props) => {
	return (
		<div
			className={cx(
				className,
				"inline-flex items-center gap-2 rounded-2xl bg-gray-97 p-7",
			)}
		>
			<Dot variant={dotVariant} />

			<PortableText
				value={value}
				className="text-center"
				components={components}
			/>
		</div>
	)
}
