import { useRef } from "react"
import { useDraggable } from "@dnd-kit/core"
import { cx } from "class-variance-authority"

interface QuadrantDraggableProps {
	index: number
	type: "today" | "tomorrow"
	top: number
	left: number
}

export const QuadrantDraggable = ({
	index,
	type,
	top,
	left,
}: QuadrantDraggableProps) => {
	const draggableRef = useRef<HTMLDivElement>(null)
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `point-${index}-${type}`,
		data: {
			type: type,
			ref: draggableRef?.current,
		},
	})

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined

	return (
		<div
			ref={setNodeRef}
			className={cx(`absolute left-0 top-0 z-10 -ml-4 -mt-4 touch-none`)}
			style={{
				...style,
				top: `${top}%`,
				left: `${left}%`,
			}}
			id={`point-${index}-${type}`}
			{...listeners}
			{...attributes}
		>
			<div
				ref={draggableRef}
				className={cx(
					"h-8 w-8 rounded-full",
					type === "today" ? "border-4 border-indigo-68" : "bg-indigo-68",
				)}
			/>
		</div>
	)
}
