import React from "react"
import Image from "next/image"
import { cx } from "class-variance-authority"
import clsx from "clsx"
import { Text } from "@/components/Text"
import { altFor, isFilled, urlFor, type SanityImage } from "@/sanity/helpers"
import { type SliderItem } from "./SlidersExercise"
import type { Answer } from "./types"
import type { SliderActions } from "./use-multiplayer-sliders"

const FULL_RANGE = 6

const RangeInput = ({
	className,
	readOnly,
	...props
}: React.ComponentPropsWithoutRef<"input">) => {
	return (
		<input
			type="range"
			className={cx(
				className,
				readOnly &&
					"[&::-webkit-slider-thumb]:cursor-not-allowed [&::-webkit-slider-thumb]:bg-gray-82 [&::-webkit-slider-thumb]:bg-[url('/slider-arrows-read-only.svg')]",
				"range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:shadow-md",
			)}
			{...props}
		/>
	)
}

interface SliderProps {
	label: string
	leftLabel: string
	rightLabel: string
	readOnly?: boolean
	value: number
	onChange?: React.ChangeEventHandler<HTMLInputElement>
	leftImage?: SanityImage
	rightImage?: SanityImage
	className?: string
}
const Slider = ({
	label,
	leftLabel,
	rightLabel,
	readOnly,
	value,
	onChange,
	leftImage,
	rightImage,
	className,
}: SliderProps) => {
	const leftToday = (value - 1) / (FULL_RANGE - 1)
	const rightToday = 1 - leftToday

	const leftFontSize = `${value * 10}px`
	const rightFontSize = `${(value * 10 - 70) * -1}px`

	return (
		<div className={cx("rounded-lg bg-gray-97 p-4", className)}>
			<Text>{label}</Text>

			<div className="relative my-3 flex h-32 justify-between overflow-hidden rounded-lg">
				{isFilled.image(leftImage) && isFilled.image(rightImage) ? (
					<>
						<div className="h-32 w-1/2 bg-black">
							<Image
								src={urlFor(leftImage).url()!}
								alt={altFor(leftImage)}
								className="h-full w-full object-cover object-center opacity-100 duration-300"
								width={300}
								height={300}
								style={{
									opacity: 1.1 - value / 10,
									filter: `grayScale(${leftToday * 100 + "%"})`,
								}}
							/>
						</div>

						<div className="h-32 w-1/2 bg-black">
							<Image
								src={urlFor(rightImage).url()!}
								alt={altFor(rightImage)}
								className="h-full w-full object-cover object-center opacity-100 duration-300"
								width={300}
								height={300}
								style={{
									opacity: 0.4 + value / 10,
									filter: `grayScale(${rightToday * 100 + "%"})`,
								}}
							/>
						</div>
					</>
				) : (
					<>
						<div
							className="flex h-full min-w-min items-center justify-center bg-pink-85 px-2 text-center transition-[width]"
							style={{ width: leftToday * 100 + "%" }}
						>
							<p
								className={clsx(
									"uppercase transition-all font-heading",
									value === 1 && "[writing-mode:vertical-lr]",
								)}
								style={{ fontSize: leftFontSize }}
							>
								{rightLabel}
							</p>
						</div>

						<div
							className="flex h-full min-w-min items-center justify-center bg-green-78 px-2 text-center transition-[width]"
							style={{ width: rightToday * 100 + "%" }}
						>
							<p
								className={clsx(
									"w-full uppercase transition font-heading",
									value === 6 && "[writing-mode:vertical-rl]",
								)}
								style={{ fontSize: rightFontSize }}
							>
								{leftLabel}
							</p>
						</div>
					</>
				)}
			</div>

			<RangeInput
				name="todayValue"
				min={1}
				max={FULL_RANGE}
				value={value}
				readOnly={readOnly}
				onChange={onChange}
			/>

			<div className="mt-2 flex justify-between text-gray-50">
				<Text>{leftLabel}</Text>
				<Text>{rightLabel}</Text>
			</div>
		</div>
	)
}

interface Props {
	item: SliderItem
	answer: Answer | undefined
	actions: SliderActions
	readOnly?: boolean
}

export const SliderPair = ({
	item,
	answer,
	actions,
	readOnly = false,
}: Props) => {
	return (
		<div className="flex flex-col gap-4">
			<h3>{item.question_text}</h3>

			<Slider
				label={item.today_text}
				leftLabel={item.left_value}
				rightLabel={item.right_value}
				readOnly={readOnly}
				value={answer?.today || 3}
				leftImage={item.left_image}
				rightImage={item.right_image}
				onChange={(e) => {
					actions.setTodayValue({ today: parseInt(e.target.value) })
				}}
			/>

			<Slider
				label={item.tomorrow_text}
				leftLabel={item.left_value}
				rightLabel={item.right_value}
				readOnly={readOnly}
				value={answer?.tomorrow || 3}
				leftImage={item.left_image}
				rightImage={item.right_image}
				onChange={(e) => {
					actions.setTomorrowValue({ tomorrow: parseInt(e.target.value) })
				}}
			/>
		</div>
	)
}
