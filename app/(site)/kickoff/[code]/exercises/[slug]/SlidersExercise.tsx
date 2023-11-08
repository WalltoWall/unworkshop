"use client"

import { useState } from "react"
import Image from "next/image"
import type { ST } from "@/sanity/config"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import { cx } from "class-variance-authority"

type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]
type Props = {
	sliders: Array<SliderItem>
}

export const SlidersExercise = ({ sliders = [] }: Props) => {
	const [value, setValue] = useState(0)

	return (
		<div className="mt-8">
			{sliders.map((slider) => (
				<div className="rounded-lg bg-gray-97 p-4" key={slider._key}>
					<h3>{slider.question_text}</h3>

					<div className="relative my-3 h-32 overflow-hidden rounded-lg">
						<div className="absolute bottom-0 left-0 right-0 top-0 h-32">
							{isFilled.image(slider.left_image) && (
								<Image
									src={urlFor(slider.left_image).url()!}
									alt={altFor(slider.left_image)}
									className="object-cover object-center opacity-100 h-full w-full"
									width={300}
									height={300}
								/>
							)}
							<p>{slider.left_value}</p>
						</div>

						<div className="absolute bottom-0 left-0 right-0 top-0 h-32">
							{isFilled.image(slider.right_image) && (
								<Image
									src={urlFor(slider.right_image).url()!}
									alt={altFor(slider.right_image)}
									className={cx("object-cover object-center h-full w-full transition ease-in-out",
										value >= 3.5 ? "opacity-100" : "opacity-0"
									)}
									width={300}
									height={300}
								/>
							)}
						</div>
					</div>

					<input
						type="range"
						min={1}
						max={6}
						value={value}
						className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
						onChange={(e) => setValue(parseInt(e.target.value))}
					/>

					<div className="flex justify-between pt-2 text-gray-50">
						<p>{slider.left_value}</p>
						<p>{slider.right_value}</p>
					</div>
				</div>
			))}
		</div>
	)
}
