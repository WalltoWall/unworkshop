"use client"

import React from "react"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import Image from "next/image"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import { count } from "console"

interface PresenterViewProps {
	exercise: ST["exercise"]
	answers: Answer[]
}

export const SlidersPresenterViewClient = ({
	exercise,
	answers,
}: PresenterViewProps) => {
	// TODO: remove when done
	console.log(answers)
	
	const [color, setColor] = React.useState("#fecb2f")
	const minRange = 1
	const maxRange = 6

	return exercise.sliders ? (
		<div>
			<div className="inline-block rounded-2xl bg-black px-5 py-4 mb-8 text-white">
				<div className="mb-2 flex items-center">
					<span
						className="block h-6 w-6"
						style={{
							backgroundColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						<span style={{
							color: color,
						}}>
							Today
						</span>
					</Text>
				</div>

				<div className="flex items-center">
					<span
						className="block h-6 w-6 border-2"
						style={{
							borderColor: color,
							backgroundImage: `repeating-linear-gradient(-45deg,${color},${color} 2px,rgba(0,0,0,0) 2px,rgba(0,0,0,0) 8px)`,
							backgroundSize: "50px 50px",
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						<span style={{
							color: color,
						}}>
							Tomorrow
						</span>
					</Text>
				</div>
			</div>

			{exercise.sliders.map((slider) => (
				<div key={slider._key} className="mt-12 mb-6 relative w-full">
					<div className="w-full h-[50vh] bg-black rounded-t-3xl overflow-hidden border-b-[0.666rem] border-black">
						<div className="flex w-full h-full">
							<div className="flex w-full h-full">
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

							<div className="absolute top-0 left-0 h-full w-full flex justify-evenly items-end gap-4 lg:gap-8">
								{/* PUT ANSWERS HERE */}
								{/* <>
								{answers[slider.slug.current].map((answer, i) => (
									<div key={i}>{answer.today}</div>
								))}
								</> */}
							</div>
						</div>
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