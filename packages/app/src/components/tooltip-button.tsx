import { Tooltip } from "radix-ui"

interface Props
	extends React.ComponentProps<"button">,
		Pick<Tooltip.TooltipContentProps, "side" | "align" | "sideOffset"> {
	tooltip: string
}

export const TooltipButton = ({
	tooltip,
	side = "top",
	align = "center",
	sideOffset = 3,
	...props
}: Props) => {
	return (
		<Tooltip.Root>
			<Tooltip.Trigger {...props} />

			<Tooltip.Portal>
				<Tooltip.Content
					side={side}
					align={align}
					sideOffset={sideOffset}
					arrowPadding={4}
					className="bg-black rounded text-white px-2 py-1.25 text-xs/tight font-medium max-w-32 text-center"
				>
					{tooltip}
					<Tooltip.Arrow className="fill-black" />
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	)
}
