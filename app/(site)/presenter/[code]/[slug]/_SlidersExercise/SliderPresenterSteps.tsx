import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"

type Props = {
	setStep: (num: number) => void
	step: number
	isDisabledLeft: boolean
	isDisabledRight: boolean
	leftText: string
	rightText: string
}

export const SliderPresenterSteps = ({
	leftText,
	rightText,
	setStep,
	step,
	isDisabledRight,
	isDisabledLeft,
}: Props) => {
	return (
		<div className="mt-12 grid grid-cols-[1fr,auto,1fr]">
			<Text className="ml-1 uppercase text-40 font-heading capsize">
				{leftText}
			</Text>

			<div className="flex items-center justify-center gap-5 self-center">
				<button
					onClick={() => {
						if (isDisabledLeft) return

						setStep(step - 1)
					}}
					disabled={isDisabledLeft}
					className="disabled:opacity-50"
				>
					<span className="sr-only">Previous Slider</span>
					<Arrow className="w-7 text-gray-50" />
				</button>

				<button
					onClick={() => {
						if (isDisabledRight) return

						setStep(step + 1)
					}}
					disabled={isDisabledRight}
					className="disabled:opacity-50"
				>
					<span className="sr-only">Next Slider</span>
					<Arrow className="w-7 rotate-180 text-gray-50" />
				</button>
			</div>

			<Text className="ml-1 justify-self-end uppercase text-40 font-heading capsize">
				{rightText}
			</Text>
		</div>
	)
}
