import React from "react"
import Image from "next/image"
import clsx from "clsx"
import { Text } from "@/components/Text"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import { type SliderItem } from "./SlidersExercise"
import type { Answer } from "./types"
import type { SliderActions } from "./use-multiplayer-sliders"

type SliderProps = {
	item: SliderItem
	answer: Answer
	actions: SliderActions
}

// TODO: Images need to be fixed to actual aspect ratio,

export const Slider = ({ item, answer, actions }: SliderProps) => {
	const values = {
		todayValue: answer?.today || 3,
		tomorrowValue: answer?.tomorrow || 3,
	}
	const [leftFontSize, setLeftFontSize] = React.useState(
		`${values.todayValue * 10}px`,
	)
	const [rightFontSize, setRightFontSize] = React.useState(
		`${(values.todayValue * 10 - 70) * -1}px`,
	)
	const [leftTomorrowFontSize, setLeftTomorrowFontSize] = React.useState(
		`${values.tomorrowValue * 10}px`,
	)
	const [rightTomorrowFontSize, setRightTomorrowFontSize] = React.useState(
		`${(values.tomorrowValue * 10 - 70) * -1}px`,
	)

	const fullRange = 6

	const leftToday = (values.todayValue - 1) / (fullRange - 1)
	const leftTomorrow = (values.tomorrowValue - 1) / (fullRange - 1)
	const rightToday = 1 - leftToday
	const rightTomorrow = 1 - leftTomorrow

	return (
		<div className="mt-8" key={item._key}>
			<h3>{item.question_text}</h3>

			<div>
				{/* TODAY */}
				<div className="mt-2 rounded-lg bg-gray-97 p-4">
					<Text>{item.today_text}</Text>
					<div className="relative my-3 flex h-32 justify-between overflow-hidden rounded-lg">
						{isFilled.image(item.left_image) ? (
							<div className="h-32 w-1/2 bg-black">
								<Image
									src={urlFor(item.left_image).url()!}
									alt={altFor(item.left_image)}
									className="h-full w-full object-cover object-center opacity-100 duration-300"
									width={300}
									height={300}
									style={{
										opacity: 1.1 - values.todayValue / 10,
										filter: `grayScale(${leftToday * 100 + "%"})`,
									}}
								/>
							</div>
						) : (
							<div
								className="flex h-full min-w-min items-center justify-center bg-pink-85 px-2 text-center transition-[width]"
								style={{
									width: leftToday * 100 + "%",
								}}
							>
								<p
									className={clsx(
										"uppercase transition-all  font-heading",
										values.todayValue === 1 && "[writing-mode:vertical-lr]",
									)}
									style={{
										fontSize: leftFontSize,
									}}
								>
									{item.right_value}
								</p>
							</div>
						)}

						{isFilled.image(item.right_image) ? (
							<div className="h-32 w-1/2 bg-black">
								<Image
									src={urlFor(item.right_image).url()!}
									alt={altFor(item.right_image)}
									className="h-full w-full object-cover object-center opacity-100 duration-300"
									width={300}
									height={300}
									style={{
										opacity: 0.4 + values.todayValue / 10,
										filter: `grayScale(${rightToday * 100 + "%"})`,
									}}
								/>
							</div>
						) : (
							<div
								className="flex h-full min-w-min items-center justify-center bg-green-78 px-2 text-center transition-[width]"
								style={{
									width: rightToday * 100 + "%",
								}}
							>
								<p
									className={clsx(
										"w-full uppercase transition font-heading",
										values.todayValue === 6 && "[writing-mode:vertical-rl]",
									)}
									style={{
										fontSize: rightFontSize,
									}}
								>
									{item.left_value}
								</p>
							</div>
						)}
					</div>
					<input
						type="range"
						name="todayValue"
						min={1}
						max={fullRange}
						value={values.todayValue}
						className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
						onChange={(e) => {
							setLeftFontSize(`${parseInt(e.target.value) * 10}px`)
							setRightFontSize(`${(parseInt(e.target.value) * 10 - 70) * -1}px`)

							actions.setTodayValue({
								today: parseInt(e.target.value),
							})
						}}
					/>
					<div className="flex justify-between pt-2 text-gray-50">
						<Text>{item.left_value}</Text>
						<Text>{item.right_value}</Text>
					</div>
				</div>

				{/* TOMORROW */}
				<div className="mt-8 rounded-lg bg-gray-97 p-4">
					<Text>{item.tomorrow_text}</Text>
					<div className="relative my-3 flex h-32 justify-between overflow-hidden rounded-lg">
						{isFilled.image(item.left_image) ? (
							<div className="h-32 w-1/2 bg-black">
								<Image
									src={urlFor(item.left_image).url()!}
									alt={altFor(item.left_image)}
									className="h-full w-full object-cover object-center opacity-100 transition"
									width={300}
									height={300}
									style={{
										opacity: 1.1 - values.tomorrowValue / 10,
										filter: `grayScale(${leftTomorrow * 100 + "%"})`,
									}}
								/>
							</div>
						) : (
							<div
								className="flex h-full min-w-min items-center justify-center bg-pink-85 px-2 text-center transition-[width]"
								style={{
									width: leftTomorrow * 100 + "%",
								}}
							>
								<p
									className={clsx(
										"uppercase transition font-heading",
										values.tomorrowValue === 1 && "[writing-mode:vertical-lr]",
									)}
									style={{
										fontSize: leftTomorrowFontSize,
									}}
								>
									{item.right_value}
								</p>
							</div>
						)}

						{isFilled.image(item.right_image) ? (
							<div className="h-32 w-1/2 bg-black">
								<Image
									src={urlFor(item.right_image).url()!}
									alt={altFor(item.right_image)}
									className="h-full w-full object-cover object-center opacity-100 transition"
									width={300}
									height={300}
									style={{
										opacity: 0.4 + values.tomorrowValue / 10,
										filter: `grayScale(${rightTomorrow * 100 + "%"})`,
									}}
								/>
							</div>
						) : (
							<div
								className="flex h-full min-w-min items-center justify-center bg-green-78 px-2 text-center transition-[width]"
								style={{
									width: rightTomorrow * 100 + "%",
								}}
							>
								<p
									className={clsx(
										"w-full uppercase transition font-heading",
										values.tomorrowValue === 6 && "[writing-mode:vertical-rl]",
									)}
									style={{
										fontSize: rightTomorrowFontSize,
									}}
								>
									{item.left_value}
								</p>
							</div>
						)}
					</div>

					<input
						type="range"
						name="tomorrowValue"
						min={1}
						max={fullRange}
						value={values.tomorrowValue}
						className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
						onChange={(e) => {
							setLeftTomorrowFontSize(`${parseInt(e.target.value) * 10}px`)
							setRightTomorrowFontSize(
								`${(parseInt(e.target.value) * 10 - 70) * -1}px`,
							)

							actions.setTomorrowValue({
								tomorrow: parseInt(e.target.value),
							})
						}}
					/>
					<div className="flex justify-between pt-2 text-gray-50">
						<Text>{item.left_value}</Text>
						<Text>{item.right_value}</Text>
					</div>
				</div>
			</div>
		</div>
	)
}
