import { ContextMenu } from "radix-ui"
import type { BrainstormS } from "../schemas"
import type { BrainstormPresenterActions } from "./use-presenter-brainstorm"
import { AddUnsortedColumnButton } from "./add-unsorted-column-button"
import { useTinykeys } from "@/lib/use-tinykeys"
import { Sticky } from "./sticky"
import clsx from "clsx"

type Props = {
	actions: BrainstormPresenterActions
	items: BrainstormS.Sticky[][]
}

export const Unsorted = (props: Props) => {
	const hasOneColumn = props.items.length === 1

	useTinykeys({
		"$mod+d": (e) => {
			if (hasOneColumn) return

			e.preventDefault()
			props.actions.deleteUnsortedColumn()
		},
		"$mod+a": (e) => {
			e.preventDefault()
			props.actions.addUnsortedColumn()
		},
	})

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="bg-neutral-100 rounded-xl overflow-auto min-h-38 py-3 px-4 flex gap-1">
				{props.items.map((col, idx) => (
					<div
						className="flex flex-col-reverse gap-1 shrink-0 w-36 empty:bg-neutral-200 rounded-lg empty:shadow-inner"
						key={idx}
					>
						{col.map((a) => (
							<Sticky
								key={a.id}
								className={clsx(
									"p-2 text-sm border-neutral-300 bg-white text-neutral-950 text-center truncate",
									"first:h-36 first:text-left first:whitespace-pre-line",
								)}
							>
								{a.value}
							</Sticky>
						))}
					</div>
				))}

				<AddUnsortedColumnButton addColumn={props.actions.addUnsortedColumn} />
			</ContextMenu.Trigger>

			<ContextMenu.Portal>
				<ContextMenu.Content
					alignOffset={5}
					className="bg-black text-white w-48 rounded-lg text-sm p-1"
				>
					<ContextMenu.Item
						onClick={props.actions.deleteUnsortedColumn}
						disabled={hasOneColumn}
						className="py-1 px-2 data-[highlighted]:bg-neutral-700 rounded ease-out duration-150 data-[highlighted]:outline-none data-[disabled]:opacity-60 flex justify-between items-baseline cursor-default"
					>
						Delete Column
						<span className="text-neutral-400 text-xs">⌘+D</span>
					</ContextMenu.Item>

					<ContextMenu.Item
						onClick={props.actions.addUnsortedColumn}
						className="py-1 px-2 data-[highlighted]:bg-neutral-700 rounded ease-out duration-150 data-[highlighted]:outline-none data-[disabled]:opacity-60 flex justify-between items-baseline cursor-default"
					>
						Add Column
						<span className="text-neutral-400 text-xs">⌘+A</span>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
}
