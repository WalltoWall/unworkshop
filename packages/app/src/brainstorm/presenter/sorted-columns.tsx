import {
	ComputerDesktopIcon,
	PlusCircleIcon,
	XCircleIcon,
} from "@heroicons/react/20/solid"
import { cx } from "class-variance-authority"
import { Popover } from "radix-ui"
import { Colors } from "@/colors"
import type { BrainstormPresenterS } from "./schemas"
import type { BrainstormPresenter } from "./use-presenter-brainstorm"

type ColumnProps = {
	column: BrainstormPresenterS.Column
	actions: BrainstormPresenter["actions"]
}

const Column = ({ column, actions }: ColumnProps) => {
	const style = Colors.style(column.color)

	return (
		<div
			key={column.id}
			className="bg-neutral-100 py-4 px-3 rounded-lg w-80 flex items-center gap-2 shrink-0"
		>
			<Popover.Root>
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
						{Colors.variants.map((v) => (
							<button
								key={v}
								className={cx(
									"border-presenter size-5 rounded-full border-2 transition duration-300 ease-out hover:scale-120",
									column.color === v ? "bg-black" : "bg-presenter",
								)}
								style={Colors.style(v)}
								onClick={() =>
									actions.updateColumnColor({ id: column.id, color: v })
								}
							>
								<span className="sr-only">Change color to {v}</span>
							</button>
						))}
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

			<button className="text-neutral-950 hover:text-brand duration-300 ease-out">
				<ComputerDesktopIcon className="size-5" />
			</button>
			<button
				className="text-neutral-950 hover:text-brand duration-300 ease-out"
				onClick={() => actions.deleteColumn({ id: column.id })}
			>
				<XCircleIcon className="size-5" />
			</button>
		</div>
	)
}

type Props = {
	actions: BrainstormPresenter["actions"]
	columns: BrainstormPresenterS.Column[]
}

export const SortedColumns = ({ actions, columns }: Props) => {
	return (
		<div className="flex gap-2 overflow-auto grow items-start scrollbar-hide -mx-4 px-4">
			{columns.map((col) => (
				<Column key={col.id} column={col} actions={actions} />
			))}

			<button
				className="rounded-lg bg-neutral-100 text-neutral-700 uppercase font-extrabold font-heading px-3 text-xl/none py-[17.5px] hover:bg-neutral-200 duration-300 ease flex items-center gap-1.5 shrink-0"
				onClick={() => actions.addColumn({ color: Colors.random() })}
			>
				Add New Column
				<PlusCircleIcon className="size-5 mt-0.5" />
			</button>
		</div>
	)
}
