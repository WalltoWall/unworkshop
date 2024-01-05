"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/Button"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"

interface ParticipantModalProps {
	participantName: string
	heading: string
	message: string
	code: string
}

export const ParticipantModal = ({
	participantName,
	heading,
	message,
	code,
}: ParticipantModalProps) => {
	return (
		<Dialog.Root>
			<Text style="copy" size={16} className="ml-4 mr-auto">
				Hi,{" "}
				<Dialog.Trigger>
					<span className="underline">{participantName}</span>
				</Dialog.Trigger>
			</Text>

			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />

				<Dialog.Content className="data-[state=open]:animate-contentShow fixed inset-x-0 bottom-0 max-h-[300px] w-full rounded-t-[24px] bg-white px-6 pb-10 pt-5 focus:outline-none">
					<div className="flex items-center justify-between">
						<Dialog.Title>
							<Text style="heading" size={24}>
								{heading}
							</Text>
						</Dialog.Title>

						<Dialog.Close>
							<BlackXIcon className="w-8" />
						</Dialog.Close>
					</div>

					<div className="flex flex-col">
						<Text
							style="copy"
							size={14}
							className="mt-5 max-w-[300px] text-gray-50"
						>
							{message}
						</Text>

						<Button href={`/kickoff/register?code=${code}`} className="mt-8">
							Confirm
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
