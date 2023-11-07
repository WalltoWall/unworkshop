"use client"

/**
 * Nits:
 *  - Adhere to `eslint` warnings. Please let me know if you would like any
 *    help setting up an integration with your editor! This would catch any
 *    un-used imports, variables, console statements, etc.
 */
import { useState } from "react"
import Image from "next/image"
import type { ST } from "@/sanity/config"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"

// NOTE: Here, we can use the ST type to extract out our types instead of defining
// them by hand.
type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]
type Props = {
	sliders: Array<SliderItem>
}

const handleValue = (event) => {
	const leftImage = document.getElementById("image-left")
	const rightImage = document.getElementById("image-right")
	const value = event.target.value

	if (rightImage != null && leftImage != null) {
		if (value > 3.5) {
			rightImage.style.opacity = "1"
		} else {
			rightImage.style.opacity = "0"
		}
	}
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
							{/* We can use the `isFilled` helpers to assert that the image is filled and available. */}
							{isFilled.image(slider.left_image) && (
								<Image
									src={urlFor(slider.left_image).url()}
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
							{isFilled.image(slider.right_image) && (
								<Image
									src={urlFor(slider.right_image).url()}
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
						// In general, try to prefer the native JS type versus
						// stringifying like you would in normal HTML. E.g.,
						// numbers should be {1} instead of "1", booleans are
						// {true} instead of "true", etc.
						min={1}
						max={6}
						value={value}
						className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
						onChange={handleValue}
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
