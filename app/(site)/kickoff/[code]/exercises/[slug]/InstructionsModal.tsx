"use client"

import { Drawer } from "vaul"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { QuestionMark } from "@/components/icons/QuestionMark"
import { Text } from "@/components/Text"

interface InstructionsModalProps {
	exerciseName: string
	instructions: string
}

export const InstructionsModal = ({
	exerciseName,
	instructions,
}: InstructionsModalProps) => {
	if (!instructions) return null

	return (
		<Drawer.Root shouldScaleBackground>
			<div className="flex items-start gap-2">
				<Text style="heading" size={40} asChild>
					<h1>{exerciseName}</h1>
				</Text>

				<Drawer.Trigger>
					<QuestionMark className="w-3" />
					<span className="sr-only">Open instructions</span>
				</Drawer.Trigger>
			</div>

			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40" />
				<Drawer.Content className="fixed inset-x-0 bottom-0 w-full rounded-t-[24px] bg-white px-6 pb-10 pt-5 focus:outline-none">
					<div className="flex items-center justify-between">
						<Drawer.Title>
							<Text style="heading" size={24}>
								Instructions
							</Text>
						</Drawer.Title>

						<Drawer.Close>
							<BlackXIcon className="w-8" />
						</Drawer.Close>
					</div>

					<Text
						style="copy"
						size={14}
						className="mt-5 whitespace-pre-line text-gray-50"
					>
						{instructions}
					</Text>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
