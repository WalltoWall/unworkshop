"use client"

// REVIEW: I have to show you Framer Motion one day 😁, I think you'd really
// like it.
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react"
import React, { useEffect } from "react"
import { CirclePicker } from "react-color"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cx } from "class-variance-authority"
import { Button } from "@/components/Button"
import { Arrow } from "@/components/icons/Arrow"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Spinner } from "@/components/Spinner"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import { PresentQuadrant } from "./PresentQuadrant"

interface PresenterViewProps {
	exercise: ST["exercise"]
	answers: Record<string, Answer[]>
}

const colors = [
	"#ff5745",
	"#ff7a45",
	"#ffe54a",
	"#19f49b",
	"#5c6dff",
	"#b652f7",
	"#ff93ea",
]

export const QuadrantsPresenterViewClient = ({
	exercise,
	answers,
}: PresenterViewProps) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	const [emblaRef, emblaApi] = useEmblaCarousel({
		watchDrag: false,
	})
	const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
	const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
	const [animating, setAnimating] = React.useState(false)
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

	useEffect(() => {
		if (!emblaApi) return

		emblaApi.scrollTo(step - 1)
	}, [step, emblaApi])

	const scrollPrev = () => {
		const params = new URLSearchParams({
			step: (step - 1).toString(),
		})

		router.push(pathname + "?" + params.toString(), { scroll: false })
	}

	const scrollNext = () => {
		const params = new URLSearchParams({
			step: (step + 1).toString(),
		})

		router.push(pathname + "?" + params.toString(), { scroll: false })
	}

	const animatePoints = () => {
		setAnimating(true)

		setTimeout(() => {
			setAnimating(false)
		}, 4000)
	}

	return exercise.quadrants ? (
		<div className="relative h-full">
			<Button
				className="absolute -right-1 -top-5 z-10 cursor-pointer"
				onClick={animatePoints}
				icon={animating && <Spinner className="-mt-1 w-[1.125rem]" />}
				disabled={animating}
			>
				{animating ? "Animating" : "Animate"}
			</Button>

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
								animating={animating}
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

			<div className="fixed bottom-7 left-7 rounded-2xl bg-black px-5 py-4 text-white">
				<div className="mb-2 flex items-center">
					<span
						className="block h-6 w-6 rounded-full border-4"
						style={{
							borderColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						Today
					</Text>
				</div>

				<div className="flex items-center">
					<span
						className="block h-6 w-6 rounded-full"
						style={{
							backgroundColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						Tomorrow
					</Text>
				</div>
			</div>

			<SettingsMenu>
				<SettingVisibility
					label="Today"
					isVisible={showToday}
					toggleVisibility={() => setShowToday((prev) => !prev)}
				/>
				<SettingVisibility
					label="Tomorrow"
					isVisible={showTomorrow}
					toggleVisibility={() => setShowTomorrow((prev) => !prev)}
				/>
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
				<Text size={12} className="block pt-2 text-white">
					Dot Colors
				</Text>
				<CirclePicker
					color={color}
					colors={colors}
					circleSize={20}
					circleSpacing={8}
					width="7.5rem"
					onChange={(newColor) => setColor(newColor.hex)}
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
