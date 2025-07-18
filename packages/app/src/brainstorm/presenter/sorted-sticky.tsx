import { Colors } from "@/colors"
import type { BrainstormS } from "../schemas"
import type { BrainstormPresenter } from "./use-presenter-brainstorm"

type Props = {
	sticky: BrainstormS.Sticky
	color: Colors.Variant
	actions: BrainstormPresenter["actions"]
}

export const SortedSticky = ({ sticky, color }: Props) => {
	const style = Colors.stickyStyle(color)

	return (
		<li
			key={sticky.id}
			style={style}
			className="shadow-md rounded font-semibold border p-2 text-sm/tight whitespace-pre-line relative"
		>
			{sticky.value}
		</li>
	)
}
