"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { altFor, urlFor } from "@/sanity/helpers"

// import { Steps } from "@/components/Steps"

interface SliderItem {
	id: number
	key: any
	question_text: string
	left_value: string
	left_image?: unknown
	right_value: string
	right_image?: unknown
	_key: string
}

type Props = {
	sliders: Array<SliderItem>
}

const handleValue = (event) => {
	const leftImage = document.getElementById("image-left")
	const rightImage = document.getElementById("image-right")
	const value = event.target.value
	console.log(leftImage)
	if (rightImage != null && leftImage != null) {
		if (value > 3.5) {
			console.log("right")
			rightImage.style.opacity = "1"
		} else {
			console.log("left")
			rightImage.style.opacity = "0"
		}
	}
}

export const SlidersExercise = ({ sliders = [] }: Props) => {
	const progressRef = useRef(null)
	const [setValue, useValue] = useState(0)

	return (
		<div className="mt-8">
			{/* <h3>{useValue}</h3> */}
			{sliders.map((slider, index) => (
				<div className="rounded-lg bg-gray-97 p-4" key={slider._key}>
					<h3>{slider.question_text}</h3>

					<div className="relative my-3 h-32 overflow-hidden rounded-lg">
						<div className="absolute bottom-0 left-0 right-0 top-0 h-32">
							{slider.left_image?.asset && (
								<Image
									src={urlFor(slider.left_image.asset).toString()}
									alt={altFor(slider.left_image)}
									className="object-over object center opacity-1 h-full w-full"
									id="image-left"
									width={300}
									height={300}
								/>
							)}
							<p>{slider.left_value}</p>
						</div>

						<div className="absolute bottom-0 left-0 right-0 top-0 h-32">
							{slider.right_image?.asset && (
								<Image
									src={urlFor(slider.right_image.asset).toString()}
									alt={altFor(slider.right_image)}
									className="object-over object center opacity-1 h-full w-full transition ease-in-out"
									id="image-right"
									width={300}
									height={300}
								/>
							)}
						</div>
					</div>

					<input
						type="range"
						min="1"
						max="6"
						className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
						onChange={handleValue}
					/>

					<div className="flex justify-between pt-2 text-gray-50">
						<p>{slider.left_value}</p>
						<p>{slider.right_value}</p>
					</div>
				</div>
			))}

			{/* <Steps
                disabled={sliders.length == 1}
                count={sliders.length * 2}
                active={active}
                onActiveChange={setActive}
                onFinish={() => alert("done")}
            /> */}
		</div>
	)
}
