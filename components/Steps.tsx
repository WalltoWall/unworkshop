import clsx from "clsx"
import { Text } from "@/components/Text"
import { Checkmark } from "./icons/Checkmark"

interface Props {
	disabled?: boolean
	count: number
	active: number
	onActiveChange?: (step: number) => void
	onFinish?: () => void
	className?: string
}

export const Steps = ({
	disabled = false,
	count,
	active = 0,
	onActiveChange,
	onFinish,
	className,
}: Props) => {
	if (!count) return null

	const handleNext = () => {
		if (active === count) {
			onFinish?.()
		} else {
			onActiveChange?.(active + 1)
		}
	}

	return (
		<div className={clsx("my-6", className)}>
			<div className="relative mx-auto h-8 w-8">
				<div className="absolute right-full top-1/2 mr-2 flex -translate-y-1/2">
					{[...Array(count - (count - active))].map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-black"></div>
					))}
				</div>

				<button
					className="flex h-8 w-8 items-center justify-center rounded-full bg-black px-2 text-white"
					onClick={handleNext}
					disabled={disabled}
				>
					{active === count ? (
						<Checkmark />
					) : (
						<svg viewBox="0 0 7.412 11.996" className="ml-0.5 w-[9px]">
							<path
								fill="none"
								fillRule="evenodd"
								stroke="currentColor"
								strokeLinecap="square"
								strokeWidth="2"
								d="m1.414 1.414 4.584 4.584-4.584 4.584"
							/>
						</svg>
					)}
				</button>

				<div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2">
					{[...Array(count - active)].map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-gray-75"></div>
					))}
				</div>
			</div>

			<Text asChild style="heading" size={16}>
				<p className="mt-3 whitespace-pre text-center font-bold uppercase">
					{active === count ? "Finish" : "Next Step"}
				</p>
			</Text>
		</div>
	)
}
