import { XCircleIcon } from "@heroicons/react/24/solid"
import { useStore } from "@nanostores/react"
import { atom } from "nanostores"
import { Drawer } from "vaul"
import { root } from "@/root"
import { text } from "@/styles/text"
import { Button } from "../Button"

export type Info = {
	open: boolean
	title: string
	description: string
	onConfirm: () => void
}

const $modal = atom<Info>({
	open: false,
	title: "",
	description: "",
	onConfirm: () => {},
})

export function open(args: Omit<Info, "open">) {
	$modal.set({ ...args, open: true })
}

export function close() {
	$modal.set({ ...$modal.get(), open: false })
}

export const Component = () => {
	const modal = useStore($modal)

	const onOpenChange = (open: boolean) => $modal.set({ ...$modal.get(), open })

	return (
		<Drawer.Root
			open={modal.open}
			onOpenChange={onOpenChange}
			shouldScaleBackground
		>
			<Drawer.Portal container={root}>
				<Drawer.Overlay className="fixed inset-0 bg-black/40" />
				<Drawer.Content className="fixed inset-x-0 bottom-0 w-full rounded-t-[24px] bg-white px-6 pt-5 pb-10 focus:outline-none">
					<Drawer.Close className="absolute top-3 right-4 fill-black text-white transition hover:fill-neutral-700">
						<XCircleIcon className="size-6 fill-inherit text-inherit" />
					</Drawer.Close>

					<div className="mx-auto w-full max-w-[36rem]">
						<Drawer.Title className={text({ size: 24, style: "heading" })}>
							{modal.title}
						</Drawer.Title>

						<Drawer.Description
							className={text({
								style: "copy",
								size: 14,
								class: "mt-2 text-gray-500",
							})}
						>
							{modal.description}
						</Drawer.Description>

						<Button className="mt-6 w-full" onClick={modal.onConfirm}>
							Confirm
						</Button>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
