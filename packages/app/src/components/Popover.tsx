"use client"

import * as RadixPopover from "@radix-ui/react-popover"

interface PopoverProps {
	trigger: React.ReactNode
	children: React.ReactNode
	side?: "right" | "top" | "bottom" | "left"
	align?: "center" | "end" | "start"
	alignOffset?: number
	sideOffset?: number
	className: string
}

export const Popover = ({
	trigger,
	children,
	side = "right",
	align = "end",
	alignOffset = 0,
	sideOffset = 0,
	className,
}: PopoverProps) => {
	return (
		<RadixPopover.Root>
			<RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

			<RadixPopover.Portal>
				<RadixPopover.Content
					side={side}
					align={align}
					alignOffset={alignOffset}
					sideOffset={sideOffset}
					className={className}
				>
					{children}
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	)
}
