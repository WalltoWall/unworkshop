"use client"

import type { MouseEventHandler } from "react"
import { useDroppable } from "@dnd-kit/core"

interface QuadrantDroppableProps {
	index: number
	children: React.ReactNode
	onClick: MouseEventHandler<HTMLDivElement>
}

export const QuadrantDroppable = ({
	index,
	children,
	onClick,
}: QuadrantDroppableProps) => {
	const { setNodeRef } = useDroppable({
		id: `droppable-${index}`,
	})
	return (
		<div
			className="absolute left-0 top-0 h-full w-full"
			ref={setNodeRef}
			onClick={onClick}
		>
			{children}
		</div>
	)
}
