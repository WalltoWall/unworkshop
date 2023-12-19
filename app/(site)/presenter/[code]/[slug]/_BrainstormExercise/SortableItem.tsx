import React, {
	createContext,
	useContext,
	useMemo,
	type CSSProperties,
	type PropsWithChildren,
} from "react"
import type {
	DraggableSyntheticListeners,
	UniqueIdentifier,
} from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Text } from "@/components/Text"

interface Props {
	id: UniqueIdentifier
	color: string
}

interface Context {
	attributes: Record<string, any>
	listeners: DraggableSyntheticListeners
	ref(node: HTMLElement | null): void
}

export const SortableItemContext = createContext<Context>({
	attributes: {},
	listeners: undefined,
	ref() {},
})

export function SortableItem({
	children,
	id,
	color,
}: PropsWithChildren<Props>) {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
	} = useSortable({ id })
	const context = useMemo(
		() => ({
			attributes,
			listeners,
			ref: setActivatorNodeRef,
		}),
		[attributes, listeners, setActivatorNodeRef],
	)

	const style: CSSProperties = {
		backgroundColor: color,
		opacity: isDragging ? 0.4 : undefined,
		transform: CSS.Translate.toString(transform),
		transition,
	}

	return (
		<SortableItemContext.Provider value={context}>
			<li
				className="box-border flex cursor-move items-center rounded-lg px-3.5 py-4"
				ref={setNodeRef}
				style={style}
			>
				{children}
			</li>
		</SortableItemContext.Provider>
	)
}

export function Draggable({ response }: { response: string }) {
	const { attributes, listeners, ref } = useContext(SortableItemContext)

	return (
		<Text
			style={"copy"}
			size={18}
			ref={ref}
			{...attributes}
			{...listeners}
			className="w-full cursor-move"
		>
			{response}
		</Text>
	)
}
