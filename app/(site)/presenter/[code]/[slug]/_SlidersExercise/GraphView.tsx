import { Button } from "@/components/Button"
import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"

export interface GraphViewProps {
	color: string
	showLines: boolean
	showToday: boolean
	showTomorrow: boolean
	answers: Array<{ today: number; tomorrow: number }>
	leftText: string
	rightText: string
	setSliderIndex: React.Dispatch<React.SetStateAction<number>>
	isDisabledLeft: boolean
	isDisabledRight: boolean
}

const Bar = (props: { color: string }) => (
	<div className="h-20" style={{ backgroundColor: props.color }} />
)

export const GraphView = ({
	color,
	showLines,
	showToday,
	showTomorrow,
	answers,
	leftText,
	rightText,
	setSliderIndex,
	isDisabledLeft,
	isDisabledRight,
}: GraphViewProps) => {
	return (
		<div className="relative flex h-full grow flex-col">
			<div className="flex justify-between">
				{/* TODO: Share component with other "dot" view */}
				<div className="rounded-2xl bg-black px-5 py-4 text-white">
					<div className="mb-2 flex items-center">
						<span
							className="block h-6 w-6 rounded-full border-[3px] bg-white"
							style={{ borderColor: color }}
						/>
						<Text className="ml-2 uppercase text-24 font-heading capsize">
							<span style={{ color: color }}>Today</span>
						</Text>
					</div>

					<div className="flex items-center">
						<span
							className="block h-6 w-6 rounded-full"
							style={{ backgroundColor: color }}
						/>
						<Text className="ml-2 uppercase text-24 font-heading capsize">
							<span style={{ color: color }}>Tomorrow</span>
						</Text>
					</div>
				</div>

				<Button>Animate</Button>
			</div>

			<div
				className="grid grow grid-cols-[repeat(6,20px)] content-between gap-x-[calc((100%-120px)/5)] py-4"
				style={{ gridTemplateRows: `repeat(${answers.length}, 20px)` }}
			>
				{showToday &&
					answers.map((answer, idx) => (
						<div
							key={idx}
							className="h-5 w-5 rounded-full"
							style={{
								background: color,
								gridColumn: answer.today,
								gridRow: idx + 1,
							}}
						/>
					))}

				{showTomorrow &&
					answers.map((answer, idx) => (
						<div
							key={idx}
							className="h-5 w-5 rounded-full border-[3px] bg-white"
							style={{
								borderColor: color,
								gridColumn: answer.tomorrow,
								gridRow: idx + 1,
							}}
						/>
					))}
			</div>

			<div className="relative -mb-8 grid grid-cols-[repeat(6,20px)] gap-x-[calc((100%-120px)/5)]">
				<Bar color={color} />
				<Bar color={color} />
				<Bar color={color} />
				<Bar color={color} />
				<Bar color={color} />
				<Bar color={color} />
			</div>

			<div className="h-2 bg-black" />

			{/* TODO: Share this footer section with other similar areas */}
			<div className="mt-12 flex justify-between">
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
		</div>
	)
}
