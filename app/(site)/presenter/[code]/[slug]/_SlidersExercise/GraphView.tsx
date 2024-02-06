import { Button } from "@/components/Button"
import { Arrow } from "@/components/icons/Arrow"
import { Spinner } from "@/components/Spinner"
import { Text } from "@/components/Text"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import { QuadrantAnswer } from "../_QuadrantsExercise/QuadrantAnswer"

export interface GraphViewProps {
	animating: boolean
	color: string
	showLines: boolean
	showToday: boolean
	showTomorrow: boolean
	animatePoints: () => void
	answers: Array<Answer>
	leftText: string
	rightText: string
	setSliderIndex: React.Dispatch<React.SetStateAction<number>>
	isDisabledLeft: boolean
	isDisabledRight: boolean
}

export const GraphView = ({
	animating,
	color,
	showLines,
	showToday,
	showTomorrow,
	animatePoints,
	answers,
	leftText,
	rightText,
	setSliderIndex,
	isDisabledLeft,
	isDisabledRight,
}: GraphViewProps) => {
	return (
		<div className="relative min-h-[95svh]">
			<div className="absolute -top-5 left-0 z-10 rounded-2xl bg-black px-5 py-4 text-white">
				<div className="mb-2 flex items-center">
					<span
						className="block h-6 w-6 rounded-full border-[3px] bg-white"
						style={{
							borderColor: color,
						}}
					/>
					<Text className="ml-2 uppercase text-24 font-heading capsize">
						<span
							style={{
								color: color,
							}}
						>
							Today
						</span>
					</Text>
				</div>

				<div className="flex items-center">
					<span
						className="block h-6 w-6 rounded-full"
						style={{
							backgroundColor: color,
						}}
					/>
					<Text className="ml-2 uppercase text-24 font-heading capsize">
						<span
							style={{
								color: color,
							}}
						>
							Tomorrow
						</span>
					</Text>
				</div>
			</div>

			<div className="absolute top-3/4 flex w-full justify-between">
				<Text className="ml-1 uppercase text-40 font-heading capsize">
					{leftText}
				</Text>

				<div className="flex items-center justify-center gap-5">
					<button
						onClick={() => {
							if (isDisabledLeft) return

							setSliderIndex((idx) => idx - 1)
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

							setSliderIndex((idx) => idx + 1)
						}}
						disabled={isDisabledRight}
						className="disabled:opacity-50"
					>
						<span className="sr-only">Next Slider</span>
						<Arrow className="w-7 rotate-180 text-gray-50" />
					</button>
				</div>
				<Text className="ml-1 uppercase text-40 font-heading capsize">
					{rightText}
				</Text>
			</div>

			<div className="absolute inset-x-0 top-2/3 h-2 -translate-y-2/3 bg-black" />
			<div
				className="absolute left-0 top-2/3 h-20 w-[20px] -translate-y-2/3"
				style={{ backgroundColor: color }}
			/>
			<div
				className="absolute left-[20%] top-2/3 h-20 w-[20px] -translate-x-[20%] -translate-y-2/3"
				style={{ backgroundColor: color }}
			/>
			<div
				className="absolute left-[40%] top-2/3 h-20 w-[20px] -translate-x-[40%] -translate-y-2/3"
				style={{ backgroundColor: color }}
			/>
			<div
				className="absolute left-[60%] top-2/3 h-20 w-[20px] -translate-x-[60%] -translate-y-2/3"
				style={{ backgroundColor: color }}
			/>
			<div
				className="absolute left-[80%] top-2/3 h-20 w-[20px] -translate-x-[80%] -translate-y-2/3"
				style={{ backgroundColor: color }}
			/>
			<div
				className="absolute right-0 top-2/3 h-20 w-[20px] -translate-y-2/3"
				style={{ backgroundColor: color }}
			/>

			<Button
				className="absolute -right-1 -top-5 z-10 cursor-pointer"
				onClick={animatePoints}
				disabled={animating}
			>
				{animating ? (
					<>
						<Spinner className="mt-[3px] w-[1.125rem]" />
						Animating
					</>
				) : (
					"Animate"
				)}
			</Button>
			{answers.map((answer, idx) => (
				<QuadrantAnswer
					key={idx}
					animating={animating}
					color={color}
					showLines={showLines}
					showToday={showToday}
					showTomorrow={showTomorrow}
					answer={answer}
				/>
			))}
		</div>
	)
}
