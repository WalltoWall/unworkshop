import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"
import { CogIcon } from "@heroicons/react/24/solid"
import { Link } from "@tanstack/react-router"
import { cx } from "class-variance-authority"
import { Popover } from "radix-ui"
import { Colors } from "@/colors"

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

	return (
		<div className="flex flex-wrap gap-2">
			{Colors.variants.map((v) => {
				const style = Colors.style(v)

				return (
					<Link
						key={v}
						to="."
						search={(p) => ({ ...p, color: v })}
						className={cx(
							"border-presenter size-6 rounded-full border-3 transition duration-300 ease-out hover:scale-120 focus:scale-120",
							color === v ? "bg-black" : "bg-presenter",
						)}
						style={style}
					>
						<span className="sr-only">Change color to {v}</span>
					</Link>
				)
			})}
		</div>
	)
}

export const Settings = {
	Root,
	Toggle,
	ColorPicker,
}
