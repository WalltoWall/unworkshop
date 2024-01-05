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

interface Props {
	id: UniqueIdentifier
	color?: string
	className?: string
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
	className,
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
			<li className={className} ref={setNodeRef} style={style}>
				{children}
			</li>
		</SortableItemContext.Provider>
	)
}

export function Draggable({
	response,
	readOnly = true,
	onEnterKeyDown,
	className,
}: {
	response: string
	readOnly?: boolean
	onEnterKeyDown?: (newResponse: string) => void
	className?: string
}) {
	const { attributes, listeners, ref } = useContext(SortableItemContext)

	return (
		<textarea
			ref={ref}
			suppressHydrationWarning
			{...attributes}
			{...listeners}
			defaultValue={response}
			className={className}
			readOnly={readOnly}
			onKeyDown={(e) => {
				if (e.key === "Enter" && onEnterKeyDown) {
					e.preventDefault()
					onEnterKeyDown(e.currentTarget.value)
				}
			}}
		/>
	)
}
