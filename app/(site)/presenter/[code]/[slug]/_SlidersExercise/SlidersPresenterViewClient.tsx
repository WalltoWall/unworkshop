"use client"

import React from "react"
import { CirclePicker } from "react-color"
import { useSearchParams } from "next/navigation"
import { SanityImage } from "@/components/SanityImage"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import { COLORS } from "@/lib/constants"
import { isFilled } from "@/sanity/helpers"
import type * as ST from "@/sanity/types.gen"
import { useMultiplayerSliders } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/use-multiplayer-sliders"
import { DotsView } from "./DotsView"
import { SliderPresenterSteps } from "./SliderPresenterSteps"
import { SlidersBars } from "./SlidersBars"
import { SlidersKey } from "./SlidersKey"

interface PresenterViewProps {
	exercise: ST.Exercise
}

export const SlidersPresenterViewClient = ({
	exercise,
}: PresenterViewProps) => {
	const [color, setColor] = React.useState("#fecb2f")
	const [showImages, setShowImages] = React.useState(true)
	const [showNumbers, setShowNumbers] = React.useState(true)
	const [showDots, setShowDots] = React.useState(false)
	const [showTodayBar, setShowTodayBar] = React.useState(true)
	const [showTomorrowBar, setShowTomorrowBar] = React.useState(true)

	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const currentSliderSlug = exercise.sliders?.[stepIdx].slug.current
	if (!currentSliderSlug) throw new Error("Error: No slug for current slider")

	const { snap } = useMultiplayerSliders({
		exerciseId: exercise._id,
		slug: currentSliderSlug,
	})

	const participants = snap.participants

	const allStepAnswers = Object.values(participants)
		.map((answers) => {
			const answer = answers[currentSliderSlug]

			return { today: answer?.today, tomorrow: answer?.tomorrow }
		})
		.filter(
			(a) => typeof a.today === "number" && typeof a.tomorrow === "number",
		)

	if (!exercise.sliders) return

	const slider = exercise.sliders[stepIdx]
	const isDisabledLeft = stepIdx <= 0
	const isDisabledRight = stepIdx + 1 >= exercise.sliders.length

	const setStep = (step: number) => {
		const params = new URLSearchParams({ step: step.toString() })
		history.pushState(null, "", "?" + params.toString())
	}

	return (
		<>
			{showDots ? (
				<DotsView
					color={color}
					answers={allStepAnswers}
					leftText={slider.left_value}
					rightText={slider.right_value}
					isDisabledLeft={isDisabledLeft}
					isDisabledRight={isDisabledRight}
					step={step}
					setStep={setStep}
				/>
			) : (
				<>
					<div className="flex h-full grow flex-col items-start">
						<SlidersKey color={color} key={color} />

						{slider && (
							<div
								key={slider._key}
								className="relative flex w-full grow flex-col overflow-hidden rounded-t-3xl border-b-8 border-black"
							>
								{showImages && (
									<>
										{isFilled.image(slider.left_image) && (
											<div className="absolute inset-y-0 left-0 w-1/2 bg-black">
												<SanityImage
													image={slider.left_image}
													className="h-full w-full object-cover object-center opacity-50"
												/>
											</div>
										)}

										{isFilled.image(slider.right_image) && (
											<div className="absolute inset-y-0 left-1/2 w-1/2 bg-black">
												<SanityImage
													image={slider.right_image}
													className="h-full w-full object-cover object-center opacity-50"
												/>
											</div>
										)}
									</>
								)}

								<SlidersBars
									answers={allStepAnswers}
									barColor={color}
									showNumbers={showNumbers}
									showToday={showTodayBar}
									showTomorrow={showTomorrowBar}
								/>
							</div>
						)}
					</div>
					<SliderPresenterSteps
						step={step}
						setStep={setStep}
						isDisabledLeft={isDisabledLeft}
						isDisabledRight={isDisabledRight}
						leftText={slider.left_value}
						rightText={slider.right_value}
					/>
				</>
			)}

			<SettingsMenu>
				{!showDots && (
					<>
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
						<SettingVisibility
							label="Show Today"
							isVisible={showTodayBar}
							toggleVisibility={() => setShowTodayBar((prev) => !prev)}
						/>
						<SettingVisibility
							label="Show Tomorrow"
							isVisible={showTomorrowBar}
							toggleVisibility={() => setShowTomorrowBar((prev) => !prev)}
						/>
					</>
				)}

				<SettingVisibility
					label="Show Dots View"
					isVisible={showDots}
					toggleVisibility={() => setShowDots((prev) => !prev)}
				/>

				<Text size={12} className="block pt-2 text-white">
					{showDots ? "Dot Color" : "Bar Color"}
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
		</>
	)
}

export default SlidersPresenterViewClient
