import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { Text } from "@/components/Text"
import { Checkmark } from "./icons/Checkmark"
import { Chevron } from "./icons/Chevron"

interface Props {
	disabled: boolean
	steps: number
	activeStep: number
	onFinish: any
	className?: string
	onNextStep?: (nextStep: number) => void
}

export const Steps = ({
	disabled,
	steps,
	activeStep = 1,
	onFinish,
	className,
	onNextStep,
}: Props) => {
	const router = useRouter()
	const pathname = usePathname()

	if (!steps) return null

	const goToStep = (step: number) => {
		const params = new URLSearchParams({
			step: step.toString(),
		})

		router.push(pathname + "?" + params.toString(), { scroll: false })

		onNextStep?.(step)
	}

	const handleNext = () => {
		if (activeStep - 1 === steps) {
			onFinish()
		} else {
			goToStep(activeStep + 1)
		}
	}

	return (
		<div className={clsx("my-6", className)}>
			<div className="relative mx-auto h-8 w-8">
				<div className="absolute right-full top-1/2 mr-2 flex -translate-y-1/2">
					{[...Array(steps - (steps - activeStep + 1))].map((_, i) => (
						<button
							key={i}
							className="mx-1 h-3 w-3 rounded-full bg-black"
							onClick={() => goToStep(i + 1)}
						/>
					))}
				</div>

				<button
					className="flex h-8 w-8 items-center justify-center rounded-full bg-black px-2 text-white disabled:bg-gray-50"
					onClick={handleNext}
					disabled={disabled}
				>
					{activeStep - 1 === steps ? (
						<Checkmark />
					) : (
						<Chevron className="ml-1 rotate-180" />
					)}
				</button>

				<div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2">
					{[...Array(steps - activeStep + 1)].map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-gray-75"></div>
					))}
				</div>
			</div>

			<Text
				style="heading"
				size={16}
				className="mt-3 whitespace-pre text-center font-bold uppercase"
			>
				{activeStep - 1 === steps ? "Finish" : "Next Step"}
			</Text>
		</div>
	)
}
