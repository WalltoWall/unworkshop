"use client"

import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { BarChart } from "@/components/icons/BarChart"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"

interface PresentColumnProps {
	cards: Array<{ id: string; response: string }>
	color: string
	columnTitle: string
}

export const PresentColumnModal = ({
	cards,
	color,
	columnTitle,
}: PresentColumnProps) => {
	return (
		<Dialog.Root>
			<div className="flex items-start gap-2">
				<Dialog.Trigger>
					<BarChart className="w-5" />
				</Dialog.Trigger>
			</div>

			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50" />

				<Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[688px] w-full max-w-[1072px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-10 focus:outline-none">
					<div className="flex items-center justify-between">
						<Dialog.Title className="flex items-center gap-2">
							<div
								className="h-5 w-5 rounded-full border border-black"
								style={{ backgroundColor: color }}
							/>
							<Text style="heading" size={24}>
								{columnTitle}
							</Text>
						</Dialog.Title>

						<Dialog.Close>
							<BlackXIcon className="w-8" />
						</Dialog.Close>
					</div>

					<div className="mt-7 flex flex-wrap gap-2">
						{cards.map((card) => (
							<div
								key={card.id}
								className="aspect-square w-[135px] rounded-lg px-3 py-3"
								style={{ backgroundColor: color }}
							>
								<Text style={"copy"} size={18}>
									{card.response}
								</Text>
							</div>
						))}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}