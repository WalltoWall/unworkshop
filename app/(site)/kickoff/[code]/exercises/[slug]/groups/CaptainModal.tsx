import { Drawer } from "vaul"
import { Button } from "@/components/Button"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"

interface Props {
	open: boolean
	onCancel: () => void
	onConfirm: () => void
}

export const CaptainModal = ({ open, onCancel, onConfirm }: Props) => {
	return (
		<Drawer.Root open={open} shouldScaleBackground>
			<Drawer.Portal>
				<Drawer.Overlay
					className="fixed inset-0 bg-black/40"
					onClick={onCancel}
				/>
				<Drawer.Content className="fixed inset-x-0 bottom-0 w-full rounded-t-[24px] bg-white px-6 pb-10 pt-5 focus:outline-none">
					<div className="flex items-center justify-between">
						<Drawer.Title>
							<Text style="heading" size={24}>
								Take over as Captain?
							</Text>
						</Drawer.Title>

						<Drawer.Close onClick={onCancel}>
							<BlackXIcon className="w-8" />
						</Drawer.Close>
					</div>

					<Text
						style="copy"
						size={16}
						className="mt-5 whitespace-pre-line text-gray-50"
					>
						This will remove the role from the current captain and make you the
						new captain. Are you sure?
					</Text>

					<div className="flex justify-end">
						<Button className="mt-8" onClick={onCancel} color="gray">
							Cancel
						</Button>
						<Button className="ml-4 mt-8" onClick={onConfirm}>
							Confirm
						</Button>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
