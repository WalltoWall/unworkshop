"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { QuestionMark } from "@/components/icons/QuestionMark"
import { Text } from "@/components/Text"

interface InstructionsModalProps {
	exerciseName: string
}

export const InstructionsModal = ({ exerciseName }: InstructionsModalProps) => {
	return (
		<Dialog.Root>
			<div className="flex items-start gap-2">
				<Text style="heading" size={40} asChild>
					<h1>{exerciseName}</h1>
				</Text>
				<Dialog.Trigger>
					<QuestionMark className="w-3" />
				</Dialog.Trigger>
			</div>

			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />

				<Dialog.Content className="data-[state=open]:animate-contentShow fixed inset-x-0 bottom-0 max-h-[300px] w-full rounded-t-[24px] bg-white px-6 pb-10 pt-5 focus:outline-none">
					<div className="flex items-center justify-between">
						<Dialog.Title>
							<Text style="heading" size={24}>
								Instructions
							</Text>
						</Dialog.Title>

						<Dialog.Close>
							<BlackXIcon className="w-8" />
						</Dialog.Close>
					</div>

					<Text
						style="copy"
						size={14}
						className="mt-5 max-w-[320px] text-gray-50"
					>
						Curabitur cursus iaculis consectetur. Lorem ipsum dolor sit amet,
						consectetur adipiscing elit. <br /> Quisque accumsan eget felis
						blandit lacinia. Nunc a turpis nec lacus consectetur semper eget ac
						erat. Fusce dictum, metus ut porttitor feugiat, tortor dui iaculis
						nisi. Phasellus eget mi mi. Morbi vulputate lacus eu enim placerat,
						sed mollis metus interdum. <br /> Ut ac vulputate sem. Maecenas
						pharetra faucibus leo, a fermentum turpis feugiat eget.
					</Text>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
