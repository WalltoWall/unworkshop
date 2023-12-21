"use client"

import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react"
import React, { useEffect } from "react"
import { cx } from "class-variance-authority"
import { Arrow } from "@/components/icons/Arrow"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import type { ST } from "@/sanity/config"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import { PresentQuadrant } from "./PresentQuadrant"

interface PresenterViewProps {
	exercise: ST["exercise"]
	answers: Record<string, Answer[]>
}

const colorGroups = [
	["#ff9488", "#ff7566", "#ff5745", "#e8503f", "#ba4033"],
	["#ff9e77", "#ff8655", "#ff7a45", "#e86f3f", "#d16439"],
	["#ffee8b", "#ffe96a", "#ffe54a", "#e8d144", "#d1bc3d"],
	["#96fad1", "#57f7b6", "#19f49b", "#17de8d", "#13b271"],
	["#a6afff", "#7987ff", "#5c6dff", "#4c5ad1", "#4350ba"],
	["#d7a0fa", "#c371f8", "#b652f7", "#a64be1", "#853cb4"],
	["#ffb7f1", "#fab99e", "#ff93ea", "#ff7be6", "#e870d2", "#e165bd"],
	[
		"#f7f7f7",
		"#E5E5E5",
		"#cdd6d4",
		"#bfbfbf",
		"#7f7f7f",
		"#8ca09c",
		"#5a6c69",
		"#2c3533",
	],
]

export const QuadrantsPresenterViewClient = ({
	exercise,
	answers,
}: PresenterViewProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		watchDrag: false,
	})
	const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
	const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
	const [showToday, setShowToday] = React.useState(true)
	const [showTomorrow, setShowTomorrow] = React.useState(true)
	const [showLines, setShowLines] = React.useState(true)
	const [showPhotos, setShowPhotos] = React.useState(true)
	const [showLabels, setShowLabels] = React.useState(true)
	const [color, setColor] = React.useState("#5c6dff")

	const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
		setPrevBtnDisabled(!emblaApi.canScrollPrev())
		setNextBtnDisabled(!emblaApi.canScrollNext())
	}, [])

	useEffect(() => {
		if (!emblaApi) return

		onSelect(emblaApi)

		emblaApi.on("reInit", onSelect)
		emblaApi.on("select", onSelect)
	}, [emblaApi, onSelect])

	const scrollPrev = React.useCallback(
		() => emblaApi && emblaApi.scrollPrev(),
		[emblaApi],
	)
	const scrollNext = React.useCallback(
		() => emblaApi && emblaApi.scrollNext(),
		[emblaApi],
	)

	return exercise.quadrants ? (
		<div className="relative h-full">
			<div className="h-full overflow-hidden" ref={emblaRef}>
				<div className="flex h-full">
					{exercise.quadrants.map((quadrant) => (
						<div key={quadrant.name} className="min-w-0 [flex:0_0_100%]">
							<PresentQuadrant
								quadrant={quadrant}
								answers={answers[quadrant.name]}
								showLines={showLines}
								showPhotos={showPhotos}
								showLabels={showLabels}
								color={color}
								showToday={showToday}
								showTomorrow={showTomorrow}
							/>
						</div>
					))}
				</div>
			</div>
			<div>
				<ArrowButton
					direction="prev"
					disabled={prevBtnDisabled}
					onClick={scrollPrev}
				/>
				<ArrowButton
					direction="next"
					disabled={nextBtnDisabled}
					onClick={scrollNext}
				/>
			</div>

			<SettingsMenu>
				<SettingVisibility
					label="Lines"
					isVisible={showLines}
					toggleVisibility={() => setShowLines((prev) => !prev)}
				/>
				<SettingVisibility
					label="Photos"
					isVisible={showPhotos}
					toggleVisibility={() => setShowPhotos((prev) => !prev)}
				/>
				<SettingVisibility
					label="Labels"
					isVisible={showLabels}
					toggleVisibility={() => setShowLabels((prev) => !prev)}
				/>
			</SettingsMenu>
		</div>
	) : null
}

const ArrowButton = ({
	direction,
	onClick,
	disabled,
}: {
	direction: "prev" | "next"
	onClick: () => void
	disabled: boolean
}) => (
	<button
		type="button"
		onClick={onClick}
		className={cx(
			"absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-38 disabled:bg-gray-50",
			direction === "prev" ? "left-0 rotate-180" : "right-0",
		)}
		disabled={disabled}
	>
		<span className="sr-only">
			{direction === "next" ? "Next Quadrant" : "Previous Quadrant"}
		</span>
		<Arrow />
	</button>
)
