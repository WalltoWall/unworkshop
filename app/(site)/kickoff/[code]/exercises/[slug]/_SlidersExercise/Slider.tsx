import React, { useState } from "react"
import Image from "next/image"
import { cx } from "class-variance-authority"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import { submitSliderAction } from "./actions"
import { type SliderItem } from "./SlidersExercise"

type Props = {
	exerciseId: string
	item: SliderItem
	group: boolean
}

export const Slider = ({ item, exerciseId, group }: Props) => {
	const [value, setValue] = useState(0)

	const formRef = React.useRef<HTMLFormElement>(null)
	const submitForm = () => formRef.current?.requestSubmit()

	return (
		<div className="mt-8 rounded-lg bg-gray-97 p-4" key={item._key}>
			<h3>{item.question_text}</h3>

			<div className="relative my-3 h-32 overflow-hidden rounded-lg">
				<div className="absolute bottom-0 left-0 right-0 top-0 h-32">
					{isFilled.image(item.left_image) && (
						<Image
							src={urlFor(item.left_image).url()!}
							alt={altFor(item.left_image)}
							className="h-full w-full object-cover object-center opacity-100"
							width={300}
							height={300}
						/>
					)}
					<p>{item.left_value}</p>
				</div>

				<div className="absolute bottom-0 left-0 right-0 top-0 h-32">
					{isFilled.image(item.right_image) && (
						<Image
							src={urlFor(item.right_image).url()!}
							alt={altFor(item.right_image)}
							className={cx(
								"h-full w-full object-cover object-center transition ease-in-out",
								value >= 3.5 ? "opacity-100" : "opacity-0",
							)}
							width={300}
							height={300}
						/>
					)}
				</div>
			</div>
			<form action={submitSliderAction} ref={formRef}>
				<input type="hidden" value={item.question_text} name="questionName" />
				<input type="hidden" value={exerciseId} name="exerciseId" />
				<input
					type="checkbox"
					defaultChecked={group}
					name="isGroup"
					className="hidden"
				/>
				<input
					type="range"
					name="value"
					min={1}
					max={6}
					value={value}
					className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
					onChange={(e) => {
						setValue(parseInt(e.target.value))
						submitForm()
					}}
				/>
			</form>
			<div className="flex justify-between pt-2 text-gray-50">
				<p>{item.left_value}</p>
				<p>{item.right_value}</p>
			</div>
		</div>
	)
}
