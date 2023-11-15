import clsx from "clsx"
import { Text } from "@/components/Text"
import { Checkmark } from "./icons/Checkmark"
import { Chevron } from "./icons/Chevron"

interface Props {
	disabled: boolean
	count: number
	active: number
	onActiveChange: any
	onFinish: any
	className?: string
}

export const Steps = ({
	disabled,
	count,
	active = 0,
	onActiveChange,
	onFinish,
	className,
}: Props) => {
	if (!count) return null

	const handleNext = () => {
		if (active === count) {
			onFinish()
		} else {
			onActiveChange(active + 1)
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
						<Chevron className="ml-1 rotate-180" />
					)}
				</button>

				<div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2">
					{[...Array(count - active)].map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-gray-75"></div>
					))}
				</div>
			</div>

			<Text
				style="heading"
				size={16}
				className="mt-3 whitespace-pre text-center font-bold uppercase"
			>
				{active === count ? "Finish" : "Next Step"}
			</Text>
		</div>
	)
}
