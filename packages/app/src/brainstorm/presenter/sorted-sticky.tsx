import { cx } from "class-variance-authority"
import { ContextMenu } from "radix-ui"
import React from "react"
import ReactDOM from "react-dom"
import { Colors } from "@/colors"
import type { BrainstormS } from "../schemas"
import type { BrainstormPresenter } from "./use-presenter-brainstorm"

type Props = {
	sticky: BrainstormS.Sticky
	color: Colors.Variant
	actions: BrainstormPresenter["actions"]
}

export const SortedSticky = ({ sticky, color }: Props) => {
	const rTextarea = React.useRef<HTMLTextAreaElement>(null)
	const style = Colors.stickyStyle(color)
	const [isEditable, setEditable] = React.useState(false)

	const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		if (!isEditable) return

		sticky.value = e.target.value
	}

	const editSticky = () => {
		ReactDOM.flushSync(() => {
			setEditable(true)
		})

		rTextarea.current?.focus()
	}

	return (
		<li key={sticky.id}>
			<ContextMenu.Root>
				<ContextMenu.Trigger style={style} asChild>
					<textarea
						ref={rTextarea}
						value={sticky.value}
						readOnly={!isEditable}
						className={cx(
							isEditable ? "cursor-vertical-text" : "cursor-default",
							"shadow-md rounded font-semibold border p-2 text-sm/tight whitespace-pre-line relative block w-full text-left hover:brightness-105 duration-300 ease-out field-sizing-content resize-none outline-none",
						)}
						onChange={onChange}
						onBlur={() => setEditable(false)}
					/>
				</ContextMenu.Trigger>

				<ContextMenu.Portal>
					<ContextMenu.Content
						alignOffset={5}
						className="bg-black text-white w-48 rounded-lg text-sm py-1.5"
					>
						<ContextMenu.Label className="px-3 text-sm/tight font-heading font-extrabold uppercase text-neutral-500">
							Move To
						</ContextMenu.Label>

						<ContextMenu.Separator className="h-px bg-neutral-500 my-2" />

						<ContextMenu.Group>
							<ContextMenu.Item
								className="py-1 px-3 data-[highlighted]:bg-neutral-700 ease-out duration-150 data-[highlighted]:outline-none data-[disabled]:opacity-60 flex justify-between items-baseline cursor-default text-xs"
								onClick={editSticky}
							>
								Edit
							</ContextMenu.Item>
							<ContextMenu.Item className="py-1 px-3 data-[highlighted]:bg-neutral-700 ease-out duration-150 data-[highlighted]:outline-none data-[disabled]:opacity-60 flex justify-between items-baseline cursor-default text-xs">
								Delete
							</ContextMenu.Item>
						</ContextMenu.Group>
					</ContextMenu.Content>
				</ContextMenu.Portal>
			</ContextMenu.Root>
		</li>
	)
}
