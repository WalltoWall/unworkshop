import PortableText from "react-portable-text"

export type Block<T = unknown> = {
	children?: React.ReactNode | Array<string>
} & T

type RichTextContent = Array<Block>

export interface RichTextProps {
	content?: RichTextContent
	className?: string
	components?: Record<string, (props: Block<unknown>) => JSX.Element>
}

export const RichText = ({ className, content, components }: RichTextProps) => {
	if (!content) return null

	return (
		<PortableText
			content={content}
			serializers={{ ...components }}
			className={className}
		/>
	)
}
