import clsx from "clsx"
import { useRememberCursorPosition } from "./hooks"

const sizes = {
	default: "min-h-32",
	small: "min-h-20",
}

export const textareaStyles =
	"w-full rounded-lg border border-gray-90 px-4 py-2.5 text-16 leading-copyMega"

interface Props
	extends Omit<React.ComponentPropsWithoutRef<"textarea">, "value"> {
	value?: string
	size?: TextareaSize
}

export type TextareaSize = keyof typeof sizes

export const Textarea = ({
	className,
	onChange,
	value,
	size = "default",
	...props
}: Props) => {
	const sizeCn = sizes[size]
	const rememberCursor = useRememberCursorPosition({ onChange, value })

	return (
		<textarea
			ref={rememberCursor.ref as React.RefObject<HTMLTextAreaElement>}
			className={clsx(
				className,
				textareaStyles,
				sizeCn,
				"resize-y",
			)}
			onChange={rememberCursor.onChange}
			value={value}
			{...props}
		/>
	)
}
