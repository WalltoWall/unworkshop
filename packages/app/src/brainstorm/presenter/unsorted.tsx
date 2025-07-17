import { PlusIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"
import { ContextMenu } from "radix-ui"
import { useTinykeys } from "@/lib/use-tinykeys"
import type { BrainstormS } from "../schemas"
import { Sticky } from "./sticky"
import type { BrainstormPresenter } from "./use-presenter-brainstorm"

type Props = {
	actions: BrainstormPresenter["actions"]
	items: BrainstormS.Sticky[][]
}

export const Unsorted = ({ actions, items }: Props) => {
	const hasOneBucket = items.length === 1

	useTinykeys({
		"$mod+d": (e) => {
			if (hasOneBucket) return

			e.preventDefault()
			actions.deleteBucket()
		},
		"$mod+a": (e) => {
			e.preventDefault()
			actions.addBucket()
		},
	})

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="bg-neutral-100 rounded-xl overflow-auto min-h-38 py-3 px-4 flex gap-1">
				{items.map((col, idx) => (
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

				<button
					className="size-36 rounded-lg bg-neutral-200 mt-auto flex flex-col justify-center items-center gap-1.5 hover:bg-neutral-300 shadow-inner duration-300 ease group/add shrink-0"
					onClick={() => actions.addBucket()}
				>
					<div className="size-8 rounded-full bg-neutral-500 text-neutral-200 flex items-center justify-center group-hover/add:bg-neutral-600 mt-4 duration-300 ease">
						<PlusIcon className="size-5" />
					</div>
					<p className="font-sans text-neutral-500 text-sm font-bold group-hover/add:text-neutral-700 duration-300 ease">
						Add Bucket
					</p>
				</button>
			</ContextMenu.Trigger>

			<ContextMenu.Portal>
				<ContextMenu.Content
					alignOffset={5}
					className="bg-black text-white w-48 rounded-lg text-sm p-1"
				>
					<ContextMenu.Item
						onClick={actions.addBucket}
						className="-mx-1 py-1 px-3 data-[highlighted]:bg-neutral-700 rounded ease-out duration-150 data-[highlighted]:outline-none data-[disabled]:opacity-60 flex justify-between items-baseline cursor-default"
					>
						Add Bucket
						<span className="text-neutral-400 text-xs">⌘+A</span>
					</ContextMenu.Item>

					<ContextMenu.Item
						onClick={actions.deleteBucket}
						disabled={hasOneBucket}
						className="-mx-1 py-1 px-3 data-[highlighted]:bg-neutral-700 rounded ease-out duration-150 data-[highlighted]:outline-none data-[disabled]:opacity-60 flex justify-between items-baseline cursor-default"
					>
						Delete Bucket
						<span className="text-neutral-400 text-xs">⌘+D</span>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
}
