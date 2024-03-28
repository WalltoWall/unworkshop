import React from "react"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { Text } from "@/components/Text"
import { Checkmark } from "./icons/Checkmark"
import { Spinner } from "./Spinner"

interface Props {
	disabled?: boolean
	steps: number
	activeStep: number
	onFinish?: () => void
	className?: string
	onNextStep?: (nextStep: number) => void
}

export const Steps = ({
	disabled = false,
	steps,
	activeStep = 1,
	onFinish,
	className,
	onNextStep,
}: Props) => {
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = React.useTransition()

	if (!steps) return null

	const goToStep = (step: number) => {
		startTransition(() => {
			const params = new URLSearchParams({ step: step.toString() })
			router.push(pathname + "?" + params.toString(), { scroll: false })
			onNextStep?.(step)
		})
	}

	const handleNext = () => {
		if (activeStep - 1 === steps) {
			startTransition(() => {
				onFinish?.()
			})
		} else {
			goToStep(activeStep + 1)
		}
	}

	return (
		<div className={clsx("mt-6", className)}>
			<div className="relative mx-auto h-8 w-8">
				<div className="absolute right-full top-1/2 mr-2 flex -translate-y-1/2">
					{Array.from({ length: steps - (steps - activeStep + 1) }).map(
						(_, i) => (
							<button
								key={i}
								className="mx-1 h-3 w-3 rounded-full bg-black"
								onClick={() => goToStep(i + 1)}
							/>
						),
					)}
				</div>

				<button
					className="flex h-8 w-8 items-center justify-center rounded-full bg-black px-2 text-white disabled:bg-gray-50"
					onClick={handleNext}
					disabled={disabled}
				>
					{isPending ? (
						<Spinner className="text-white" />
					) : activeStep - 1 === steps ? (
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
					{Array.from({ length: steps - activeStep + 1 }).map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-gray-75" />
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
