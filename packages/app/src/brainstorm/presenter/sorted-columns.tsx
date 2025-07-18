import {
	ComputerDesktopIcon,
	PlusCircleIcon,
	XCircleIcon,
} from "@heroicons/react/20/solid"
import { Reorder } from "motion/react"
import { Popover } from "radix-ui"
import React from "react"
import { Colors } from "@/colors"
import { ColorSwatchPicker } from "@/components/color-swatch-picker"
import { TooltipButton } from "../../components/tooltip-button"
import type { BrainstormS } from "../schemas"
import type { BrainstormMultiplayer } from "../use-multiplayer-brainstorm"
import type { BrainstormPresenterS } from "./schemas"
import { SortedSticky } from "./sorted-sticky"
import type { BrainstormPresenter } from "./use-presenter-brainstorm"

type ColumnProps = {
	column: BrainstormPresenterS.Column
	actions: BrainstormPresenter["actions"]
	participantActions: BrainstormMultiplayer["actions"]
	sortedStickyMap: Map<string, BrainstormS.Sticky>
}

const Column = ({
	participantActions,
	column,
	actions,
	sortedStickyMap,
}: ColumnProps) => {
	const [popoverOpen, setPopoverOpen] = React.useState(false)
	const style = Colors.style(column.color)

	return (
		<Reorder.Item
			value={column}
			as="div"
			className="bg-neutral-100 py-4 px-3 rounded-lg w-80 shrink-0 cursor-grab active:cursor-grabbing flex flex-col gap-2"
			layout="position"
		>
			<div className="flex items-center gap-2">
				<Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
					<Popover.Trigger
						className="bg-presenter size-5 rounded-full border-2 transition duration-300 ease-out hover:brightness-125"
						style={style}
					>
						<span className="sr-only">Change column color</span>
					</Popover.Trigger>

					<Popover.Portal>
						<Popover.Content
							side="bottom"
							align="start"
							alignOffset={4}
							sideOffset={4}
							arrowPadding={20}
							className="flex w-48 flex-wrap gap-2 bg-black p-3 text-white rounded-2xl"
						>
							<Popover.Arrow width={16} height={8} />
							<ColorSwatchPicker
								size="default"
								hover
								activeColor={column.color}
								onSwatchClick={(color) => {
									actions.updateColumnColor({ id: column.id, color })
									setPopoverOpen(false)
								}}
							/>
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>

				<input
					type="text"
					name="title"
					value={column.title}
					placeholder="Column Name"
					className="font-heading text-xl/none font-extrabold text-neutral-700 focus:outline-none uppercase grow"
					onChange={(e) =>
						actions.updateColumnTitle({ id: column.id, title: e.target.value })
					}
				/>

				<TooltipButton
					tooltip="Present"
					className="text-neutral-950 hover:text-brand duration-300 ease-out"
				>
					<ComputerDesktopIcon className="size-5" />
				</TooltipButton>
				<TooltipButton
					className="text-neutral-950 hover:text-brand duration-300 ease-out"
					tooltip="Delete"
					onClick={() => actions.deleteColumn({ id: column.id })}
				>
					<XCircleIcon className="size-5" />
				</TooltipButton>
			</div>

			{column.stickies.length > 0 && (
				<ul className="flex flex-col gap-1">
					{column.stickies.map((stickyId) => {
						const sticky = sortedStickyMap.get(stickyId)
						if (!sticky) return null

						return (
							<SortedSticky
								key={stickyId}
								participantActions={participantActions}
								color={column.color}
								sticky={sticky}
								actions={actions}
							/>
						)
					})}
				</ul>
			)}
		</Reorder.Item>
	)
}

type Props = {
	actions: BrainstormPresenter["actions"]
	columns: BrainstormPresenterS.Column[]
	participantActions: BrainstormMultiplayer["actions"]
	sorted: BrainstormS.Sticky[]
}

export const SortedColumns = ({
	sorted,
	actions,
	columns,
	participantActions,
}: Props) => {
	// Used for quick lookups by sticky ID. Used when rendering a column's
	// stickies since a column only stores its stickies by ID.
	const sortedStickyMap = new Map(sorted.map((s) => [s.id, s]))

	return (
		<Reorder.Group
			values={columns}
			onReorder={actions.updateColumns}
			layoutScroll
			axis="x"
			as="div"
			className="flex gap-2 overflow-auto grow items-start scrollbar-hide -mx-4 px-4"
		>
			{columns.map((col) => (
				<Column
					key={col.id}
					participantActions={participantActions}
					column={col}
					actions={actions}
					sortedStickyMap={sortedStickyMap}
				/>
			))}

			<button
				className="rounded-lg bg-neutral-100 text-neutral-700 uppercase font-extrabold font-heading px-3 text-xl/none py-[17.5px] hover:bg-neutral-200 duration-300 ease flex items-center gap-1.5 shrink-0"
				onClick={() => actions.addColumn({ color: Colors.random() })}
			>
				Add New Column
				<PlusCircleIcon className="size-5 mt-0.5" />
			</button>
		</Reorder.Group>
	)
}
