"use client"

import React from "react"
import { CirclePicker } from "react-color"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Arrow } from "@/components/icons/Arrow"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import { COLORS } from "@/lib/constants"
import type { ST } from "@/sanity/config"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import { useMultiplayerSliders } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/use-multiplayer-sliders"
import { SlidersBars } from "./SlidersBars"
import { SlidersKey } from "./SlidersKey"

interface PresenterViewProps {
	exercise: ST["exercise"]
	participantId: string
}

export const SlidersPresenterViewClient = ({
	exercise,
	participantId,
}: PresenterViewProps) => {
	const [color, setColor] = React.useState("#fecb2f")
	const [showImages, setShowImages] = React.useState(true)
	const [showNumbers, setShowNumbers] = React.useState(true)
	const [sliderIndex, setSliderIndex] = React.useState(0)

	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1
	const currentSliderSlug = exercise.sliders?.[stepIdx].slug.current

	if (!currentSliderSlug) throw new Error("Error: No slug for current slider")

	const { snap } = useMultiplayerSliders({
		exerciseId: exercise._id,
		participantId,
		slug: currentSliderSlug,
	})

	const participants = snap.participants

	const allAnswers = Object.entries(participants).flatMap((participant) => {
		const answers: Array<Answer & { slug?: string }> = []
		let slidersAnswer: Answer & { slug?: string } = {}
		Object.entries(participant[1]).map((answer) => {
			slidersAnswer.today = answer[1].today
			slidersAnswer.tomorrow = answer[1].tomorrow
			slidersAnswer.slug = answer[0]
			answers.push(slidersAnswer)
			slidersAnswer = { today: 0, tomorrow: 0, slug: "" }
		})

		return answers
	})

	if (!exercise.sliders) return

	const slider = exercise.sliders[sliderIndex]
	const isDisabledLeft = sliderIndex <= 0
	const isDisabledRight = exercise.sliders.length <= sliderIndex + 1

	const currentAnswers = allAnswers.filter(
		(answer) => answer.slug === slider.slug.current,
	)

	return (
		<div>
			<SlidersKey barColor={color} key={color} />

			{slider && (
				<div key={slider._key} className="relative mb-6 mt-12 w-full">
					<div className="h-[45vh] w-full overflow-hidden rounded-t-3xl border-b-[0.667rem] border-black">
						{isFilled.image(slider.left_image) &&
							showImages &&
							isFilled.image(slider.right_image) && (
								<div className="flex h-full w-full bg-black">
									{isFilled.image(slider.left_image) && (
										<div className="w-full">
											<Image
												src={urlFor(slider.left_image).url()!}
												alt={altFor(slider.left_image)}
												className="h-full w-full object-cover object-center opacity-50"
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
												className="h-full w-full object-cover object-center opacity-50"
												width={300}
												height={300}
											/>
										</div>
									)}
								</div>
							)}

						<SlidersBars
							answers={currentAnswers}
							barColor={color}
							showNumbers={showNumbers}
							showImages={showImages}
						/>
					</div>

					<div className="mt-10 flex w-full items-end justify-between">
						<Text className="ml-1 uppercase text-40 font-heading capsize">
							{slider.left_value}
						</Text>
						<Text className="ml-1 uppercase text-40 font-heading capsize">
							{slider.right_value}
						</Text>
					</div>
				</div>
			)}

			<div className="relative">
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

				<SettingsMenu>
					<SettingVisibility
						label="Photos"
						isVisible={showImages}
						toggleVisibility={() => setShowImages((prev) => !prev)}
					/>
					<SettingVisibility
						label="Numbers"
						isVisible={showNumbers}
						toggleVisibility={() => setShowNumbers((prev) => !prev)}
					/>
					<Text size={12} className="block pt-2 text-white">
						Bar Colors
					</Text>
					<CirclePicker
						color={color}
						colors={COLORS}
						circleSize={20}
						circleSpacing={8}
						width="7.5rem"
						onChange={(newColor) => setColor(newColor.hex)}
					/>
				</SettingsMenu>
			</div>
		</div>
	)
}

export default SlidersPresenterViewClient
