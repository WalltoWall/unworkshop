import { Colors } from "@/colors"
import clsx from "clsx"

type Props = {
	color?: Colors.Variant
	children: React.ReactNode
	className?: string
}

export const Sticky = (props: Props) => {
	const stickyStyle = props.color ? Colors.stickyStyle(props.color) : undefined

	return (
		<div
			style={stickyStyle}
			className={clsx(
				props.className,
				"rounded-lg shadow-md font-semibold border",
			)}
		>
			{props.children}
		</div>
	)
}
