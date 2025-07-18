import clsx from "clsx"
import { Colors } from "@/colors"
import { swatchStyles } from "@/components/color-swatch-picker"
import { TooltipButton } from "@/components/tooltip-button"
import type { BrainstormS } from "../schemas"
import type { BrainstormPresenterS } from "./schemas"
import type { BrainstormPresenter } from "./use-presenter-brainstorm"

type Props = {
	stickyId: BrainstormS.Sticky["id"]
	color?: Colors.Variant
	children: React.ReactNode
	className?: string
	hoverable: boolean
	columns: BrainstormPresenterS.Column[]
	actions: BrainstormPresenter["actions"]
}

export const UnsortedSticky = ({
	stickyId,
	actions,
	children,
	columns,
	hoverable,
	className,
	color,
}: Props) => {
	const stickyStyle = color ? Colors.stickyStyle(color) : undefined

	return (
		<div
			style={stickyStyle}
			className={clsx(
				className,
				"rounded-lg shadow-md font-semibold border relative p-2 text-sm border-neutral-300 text-neutral-950 truncate bg-white",
			)}
		>
			{children}

			{hoverable && (
				<div className="transition ease-out absolute inset-0 bg-neutral-700 backdrop-blur-sm opacity-0 hover:opacity-100 text-white p-2 font-normal rounded-lg border-neutral-700 shadow-md duration-150 flex flex-col gap-2 justify-between">
					<p>{children}</p>
					<div className="flex flex-wrap gap-2 justify-center">
						{columns.map((col) => (
							<TooltipButton
								key={col.id}
								tooltip={col.title}
								className={swatchStyles({ size: "small", hover: false })}
								style={Colors.style(col.color)}
								side="bottom"
								onClick={() =>
									actions.assignSticky({ columnId: col.id, stickyId: stickyId })
								}
							>
								<span className="sr-only">Assign to column {col.title}</span>
							</TooltipButton>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
