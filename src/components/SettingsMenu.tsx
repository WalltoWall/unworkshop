import * as Popover from "@radix-ui/react-popover"
import { CogIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { cx } from "class-variance-authority"
import { Colors } from "@/colors"

type RootProps = {
	children: React.ReactNode
	className?: string
}
const Root = (props: RootProps) => (
	<Popover.Root>
		<Popover.Trigger className={cx(props.className, "group")}>
			<span className="sr-only">Open Settings Menu</span>
			<CogIcon
				className="size-10 text-black transition group-hover:text-neutral-700"
				strokeWidth={3}
			/>
		</Popover.Trigger>

		<Popover.Portal>
			<Popover.Content
				side="left"
				align="end"
				alignOffset={30}
				sideOffset={-4}
				className="min-w-36 gap-4 rounded-2xl bg-black px-5 py-4 text-white"
			>
				{props.children}
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
)
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
				<EyeIcon className="size-5" />
			) : (
				<EyeOffIcon className="size-5" />
			)}

			<span className="text-[12px] leading-none">{props.children}</span>
		</button>
	)
}

const ColorPicker = () => {
	const [color, setColor] = Colors.useActive()

	return <div></div>
}

export const Settings = {
	Root,
	Toggle,
	ColorPicker,
}
