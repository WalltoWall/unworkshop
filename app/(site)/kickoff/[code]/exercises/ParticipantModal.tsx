"use client"

import { useRouter } from "next/navigation"
import { Drawer } from "vaul"
import { Button } from "@/components/Button"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"

interface ParticipantModalProps {
	participantName: string
	heading: string
	message: string
	code: string
	onConfirm: () => void
}

export const ParticipantModal = ({
	participantName,
	heading,
	message,
	code,
	onConfirm,
}: ParticipantModalProps) => {
	const router = useRouter()

	const handleConfirm = async () => {
		await onConfirm()
		router.push(`/kickoff/register?code=${code}`)
	}

	return (
		<Drawer.Root shouldScaleBackground>
			<Text style="copy" size={16} className="ml-4 mr-auto">
				Hi,{" "}
				<Drawer.Trigger>
					<span className="underline">{participantName}</span>
				</Drawer.Trigger>
			</Text>

			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40" />
				<Drawer.Content className="fixed inset-x-0 bottom-0 w-full rounded-t-[24px] bg-white px-6 pb-10 pt-5 focus:outline-none">
					<div className="flex items-center justify-between">
						<Drawer.Title>
							<Text style="heading" size={24}>
								{heading}
							</Text>
						</Drawer.Title>

						<Drawer.Close>
							<BlackXIcon className="w-8" />
						</Drawer.Close>
					</div>

					<div className="flex flex-col">
						<Text
							style="copy"
							size={14}
							className="mt-5 max-w-[260px] text-gray-50"
						>
							{message}
						</Text>

						<Button onClick={handleConfirm} className="mt-8">
							Confirm
						</Button>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
