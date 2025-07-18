import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"
import { CogIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "@tanstack/react-router"
import { cx } from "class-variance-authority"
import { Popover } from "radix-ui"
import { Colors } from "@/colors"
import { ColorSwatchPicker } from "./color-swatch-picker"

type RootProps = {
	children: React.ReactNode
	className?: string
}
const Root = (props: RootProps) => {
	return (
		<Popover.Root>
			<Popover.Trigger className={cx(props.className, "group")}>
				<span className="sr-only">Open Settings Menu</span>
				<CogIcon className="size-10 text-black transition group-hover:text-neutral-700" />
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					side="left"
					align="end"
					alignOffset={30}
					sideOffset={-4}
					className="z-50 flex w-48 flex-col gap-4 rounded-2xl bg-black p-4 text-white"
				>
					{props.children}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
Root.displayName = "Settings.Root"

type ToggleProps = {
	children: string
	checked: boolean
	onCheckedChanged: (checked: boolean) => void
}

const Toggle = (props: ToggleProps) => {
	return (
		<button
			className="grid grid-cols-[auto_1fr] items-center gap-2 text-left transition-opacity hover:text-neutral-300"
			onClick={() => props.onCheckedChanged(!props.checked)}
		>
			{props.checked ? (
				<EyeIcon className="size-4.5" />
			) : (
				<EyeSlashIcon className="size-4.5" />
			)}

			<span className="text-[12px] leading-none">{props.children}</span>
		</button>
	)
}

const ColorPicker = () => {
	const color = Colors.useActive()
	const navigate = useNavigate()

	return (
		<div className="flex flex-wrap gap-2">
			<ColorSwatchPicker
				hover
				activeColor={color}
				onSwatchClick={(color) => navigate({ to: ".", search: { color } })}
			/>
		</div>
	)
}

export const Settings = {
	Root,
	Toggle,
	ColorPicker,
}
