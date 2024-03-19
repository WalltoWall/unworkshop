"use client"

import * as Dialog from "@radix-ui/react-dialog"
import React from "react"
import clsx from "clsx"
import { Arrow } from "@/components/icons/Arrow"
import { BarChart } from "@/components/icons/BarChart"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"
import type { Columns } from "./BrainstormPresenterViewClient"

interface PresentColumnProps {
	columns: Columns
	index: number
}

export const PresentColumnModal = ({ columns, index }: PresentColumnProps) => {
	const [idx, setIdx] = React.useState(index)
	const activeColumn = columns[idx]

	const isDisabledLeft = idx - 1 <= 0
	const isDisabledRight = columns.length <= idx + 1

	if (!activeColumn) return

	return (
		<Dialog.Root>
			<div className="flex items-start gap-2">
				<Dialog.Trigger>
					<BarChart className="w-5" />
				</Dialog.Trigger>
			</div>

			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />

				<Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[688px] w-full max-w-[1072px] -translate-x-1/2 -translate-y-1/2 focus:outline-none">
					<div className=" rounded-3xl bg-white p-10">
						<div className="flex items-center justify-between">
							<Dialog.Title className="flex items-center gap-2">
								<div
									className="h-5 w-5 rounded-full border border-black"
									style={{ backgroundColor: activeColumn.color }}
								/>
								<Text style="heading" size={24}>
									{activeColumn.title}
								</Text>
							</Dialog.Title>

							<Dialog.Close>
								<BlackXIcon className="w-8" />
							</Dialog.Close>
						</div>

						<div className="mt-7 flex flex-wrap gap-2">
							{activeColumn.cards.map((card) => (
								<div
									key={card.id}
									className="aspect-square w-[135px] break-words rounded-lg px-3 py-3"
									style={{ backgroundColor: activeColumn.color }}
								>
									<Text style={"copy"} size={18}>
										{card.response}
									</Text>
								</div>
							))}
						</div>
					</div>
					<div className="mt-9 flex items-center justify-center gap-6">
						<button
							onClick={() => {
								if (isDisabledLeft) return

								setIdx(idx - 1)
							}}
							disabled={isDisabledLeft}
							className={clsx(isDisabledLeft && "opacity-50")}
						>
							<Arrow className="w-6  text-white" />
						</button>
						<button
							onClick={() => {
								if (isDisabledRight) return

								setIdx(idx + 1)
							}}
							disabled={isDisabledRight}
							className={clsx(isDisabledRight && "opacity-50")}
						>
							<Arrow className="w-6 rotate-180 text-white" />
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
