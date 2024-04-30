import { ArrowBigLeftIcon, ArrowBigRightIcon } from "lucide-react"
import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { Text } from "@/components/Text"
import { Checkmark } from "./icons/Checkmark"
import { Spinner } from "./Spinner"

interface Props {
	disabled?: boolean
	steps: number
	activeStep: number
	className?: string
	onFinish?: () => void
	onNextStep?: (nextStep: number) => void
}

export const Steps = ({
	disabled = false,
	steps,
	activeStep = 1,
	className,
	onFinish,
	onNextStep,
}: Props) => {
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = React.useTransition()

	const goToStep = (step: number) => {
		startTransition(() => {
			const params = new URLSearchParams({ step: step.toString() })
			router.push(pathname + "?" + params.toString(), { scroll: false })
			onNextStep?.(step)
		})
	}

	const handleNext = () => {
		if (activeStep - 1 === steps) {
			startTransition(() => onFinish?.())
		} else {
			goToStep(activeStep + 1)
		}
	}

	return (
		<div className={cx(className, "flex items-center justify-between")}>
			<button
				className={cx(
					activeStep <= 1 && "invisible",
					"flex w-14 items-center gap-1.5",
				)}
				onClick={() => goToStep(activeStep - 1)}
			>
				<ArrowBigLeftIcon className="w-5 fill-black" />
				<Text style="heading" size={20}>
					Back
				</Text>
			</button>

			<div className="relative">
				<div className="absolute inset-y-0 right-full mr-2 flex items-center gap-2">
					{R.range(0, activeStep - 1).map((i) => (
						<button
							key={i}
							className="size-3 rounded-full bg-gray-75"
							onClick={() => goToStep(i + 1)}
						>
							<div className="sr-only">Go to step {i + 1}</div>
						</button>
					))}
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
						<Text className="font-bold" size={16}>
							{activeStep}
						</Text>
					)}
				</button>

				<div className="absolute inset-y-0 left-full ml-2 flex items-center gap-2">
					{R.range(activeStep, steps + 1).map((i) => (
						<button
							key={i}
							className="size-3 rounded-full bg-gray-75"
							onClick={() => goToStep(i + 1)}
						>
							<div className="sr-only">Go to step {i + 1}</div>
						</button>
					))}
				</div>
			</div>

			<button
				className={cx(
					activeStep > steps && "invisible",
					"flex w-14 items-center gap-1.5",
				)}
				onClick={() => goToStep(activeStep + 1)}
			>
				<Text style="heading" size={20}>
					Next
				</Text>
				<ArrowBigRightIcon className="w-5 fill-black" />
			</button>
		</div>
	)
}
