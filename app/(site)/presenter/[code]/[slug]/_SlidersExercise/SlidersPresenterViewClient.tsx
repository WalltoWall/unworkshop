"use client"

import React from "react"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import Image from "next/image"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import { SlidersBars } from "./SlidersBars"
import { SlidersKey } from "./SlidersKey"

interface PresenterViewProps {
	exercise: ST["exercise"]
	answers: Answer[]
}

export const SlidersPresenterViewClient = ({
	exercise,
	answers,
}: PresenterViewProps) => {
	
	const [color, setColor] = React.useState("#fecb2f")

	return exercise.sliders ? (
		<div>
			<SlidersKey/>

			{exercise.sliders.map((slider) => (
				<div key={slider._key} className="mt-12 mb-6 relative w-full">
					<div className="w-full h-[50vh] rounded-t-3xl overflow-hidden border-b-[0.666rem] border-black">

							{(isFilled.image(slider.left_image) && isFilled.image(slider.right_image)) && (
								<div className="flex w-full h-full bg-black">
									{isFilled.image(slider.left_image) && (
											<div className="w-full">
												<Image
													src={urlFor(slider.left_image).url()!}
													alt={altFor(slider.left_image)}
													className="object-cover opacity-50 object-center h-full w-full"
													width={300}
													height={300}
												/>
											</div>
									)}
									{isFilled.image(slider.right_image) && (
										<div className="w-full">
											<Image
												src={urlFor(slider.right_image).url()!}
												alt={altFor(slider.right_image)}
												className="object-cover opacity-50 object-center h-full w-full"
												width={300}
												height={300}
											/>
										</div>
									)}
								</div>
							)}
							
							{/* David: Not sure what type to make the slider prop */}
							<SlidersBars answers={answers} slider={slider} images={(isFilled.image(slider.left_image) && isFilled.image(slider.right_image))}/>

					</div>
					
					<div className="w-full flex justify-between items-end mt-10">
						<Text className="ml-1 uppercase text-40 font-heading capsize">{slider.left_value}</Text>
						<Text className="ml-1 uppercase text-40 font-heading capsize">{slider.right_value}</Text>
					</div>
				</div>
			))}
		</div>
	) : null
}
