"use client"

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"
import Image from "next/image"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { RichText, type RichTextContent } from "@/components/RichText"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { altFor, urlFor, type SanityImage } from "@/sanity/helpers"
import { QuadrantArrow } from "./QuadrantArrow"
import { QuadrantDraggable } from "./QuadrantDraggable"
import { QuadrantDroppable } from "./QuadrantDroppable"
import { getTime } from "./QuadrantSteps"
import type { Answer } from "./types"

const serializers = {
	strong: ({ children }: { children?: string[] | React.ReactNode }) => (
		<strong className="text-indigo-68">{children}</strong>
	),
}

const QuadrantImage = ({ image }: { image: SanityImage }) => (
	<Image
		src={urlFor(image).width(150).height(150).format("webp").toString()}
		alt={altFor(image)}
		className="max-h-[45px] w-full max-w-[45px] object-contain sm:max-h-[90px] sm:max-w-[90px]"
		width={150}
		height={150}
	/>
)

type QuadrantProps = {
	item: NonNullable<ST["exercise"]["quadrants"]>[number]
	index: number
	active: number
	results: Answer[]
	setResults: Dispatch<SetStateAction<Answer[]>>
	todayInstructions?: ST["exercise"]["today_instructions"]
	tomorrowInstructions?: ST["exercise"]["tomorrow_instructions"]
	finalInstructions?: ST["exercise"]["finalize_instructions"]
}

export const Quadrant = ({
	item,
	index,
	active,
	results,
	setResults,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
}: QuadrantProps) => {
	const [opacity, setOpacity] = useState("opacity-0")
	const clickTarget = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const time = getTime(active, index)

		if (time === "tomorrow" || !time) {
			setOpacity("opacity-100")
		} else {
			setOpacity("opacity-0")
		}
	}, [results])

	const movePoint = useCallback(
		(id: string, left: number, top: number) => {
			const newResults = [...results] as Answer[]
			let updatedPositions = { ...newResults[index] }
			updatedPositions = {
				...updatedPositions,
				[id]: {
					top,
					left,
					placed: true,
				},
			}

			if (id === "tomorrow") {
				updatedPositions.arrow = moveArrow(
					left,
					updatedPositions.today.left,
					top,
					updatedPositions.today.top,
				)
			} else {
				updatedPositions.arrow = moveArrow(
					updatedPositions.tomorrow.left,
					left,
					updatedPositions.tomorrow.top,
					top,
				)
			}

			newResults[index] = updatedPositions

			setResults(newResults)
		},
		[results, setResults, index],
	)

	const moveArrow = (
		leftOne: number,
		leftTwo: number,
		topOne: number,
		topTwo: number,
	) => {
		const arrowY = leftOne - leftTwo
		const arrowX = topOne - topTwo

		const arrowAngle =
			(Math.atan2(topOne - topTwo, leftOne - leftTwo) * 180) / Math.PI

		const arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)

		const arrow = {
			top: topTwo,
			left: leftTwo,
			width: arrowWidth,
			angle: arrowAngle,
		}

		return arrow
	}

	const handleDragEnd = (event: DragEndEvent) => {
		if (clickTarget?.current) {
			const { type, ref } = event.active.data.current!
			const parentRect = clickTarget.current.getBoundingClientRect()

			if (ref) {
				var pointRect = ref.getBoundingClientRect()
				const top =
					((pointRect.top + 16 - parentRect.top) /
						clickTarget.current.clientHeight) *
					100
				const left =
					((pointRect.left + 16 - parentRect.left) /
						clickTarget.current.clientWidth) *
					100

				if (top >= 0 && top <= 100 && left >= 0 && left <= 100) {
					movePoint(type, left, top)
				}
			}
		}
	}

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (clickTarget?.current) {
			const parentRect = clickTarget.current.getBoundingClientRect()
			const time = getTime(active, index)
			const top =
				((event.clientY - parentRect.top) / clickTarget.current.clientHeight) *
				100
			const left =
				((event.clientX - parentRect.left) / clickTarget.current.clientWidth) *
				100
			if (time === "today") {
				movePoint("today", left, top)
			} else if (time === "tomorrow") {
				movePoint("tomorrow", left, top)
			}
		}
	}

	return (
		<>
			{(getTime(active, index) !== false || index === 0) && (
				<div className="text-center">
					<div className="inline-flex content-center items-center rounded-2xl bg-gray-97 px-7 pb-6 pt-7">
						{getTime(active, index) === "today" ? (
							<div className="mr-2 h-8 w-8 flex-none rounded-full border-4 border-indigo-68" />
						) : getTime(active, index) === "tomorrow" ? (
							<div className="mr-2 h-8 w-8 flex-none rounded-full bg-indigo-68" />
						) : null}

						<Text style="heading" size={18} asChild>
							<h2>
								<RichText
									content={
										getTime(active, index) === "today"
											? (todayInstructions as RichTextContent)
											: active === results.length * 2
											? (finalInstructions as RichTextContent)
											: (tomorrowInstructions as RichTextContent)
									}
									components={{ ...serializers }}
								/>
							</h2>
						</Text>
					</div>
				</div>
			)}

			<div className="relative p-7 md:p-12">
				<h3 className="absolute left-0 top-2 w-full text-center text-gray-50 md:top-5">
					{item.topValue}
				</h3>
				<h3 className="absolute bottom-1 left-0 w-full text-center text-gray-50 md:bottom-5">
					{item.bottomValue}
				</h3>
				<h3 className="absolute bottom-0 left-7 w-full origin-bottom-left -rotate-90 text-center text-gray-50 md:left-11">
					{item.leftValue}
				</h3>
				<h3 className="absolute bottom-0 right-7 w-full origin-bottom-right rotate-90 text-center text-gray-50 md:right-11">
					{item.rightValue}
				</h3>

				<div
					ref={clickTarget}
					className="relative before:block before:pt-[100%]"
				>
					<div className="absolute left-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-r-2 border-gray-50">
						{item.topLeftImage?.asset && (
							<QuadrantImage image={item.topLeftImage} />
						)}
					</div>
					<div className="absolute right-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-gray-50">
						{item.topRightImage?.asset && (
							<QuadrantImage image={item.topRightImage} />
						)}
					</div>
					<div className="absolute bottom-0 left-0 flex h-1/2 w-1/2 items-center justify-center border-r-2 border-gray-50">
						{item.bottomLeftImage?.asset && (
							<QuadrantImage image={item.bottomLeftImage} />
						)}
					</div>
					<div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 items-center justify-center">
						{item.bottomRightImage?.asset && (
							<QuadrantImage image={item.bottomRightImage} />
						)}
					</div>

					<DndContext
						onDragEnd={handleDragEnd}
						onDragMove={() => setOpacity("opacity-0")}
					>
						<QuadrantDroppable index={index} onClick={handleClick}>
							<QuadrantDraggable
								index={index}
								result={results[index].today}
								type="today"
							/>
							<QuadrantArrow
								result={results[index].arrow}
								opacity={opacity}
								time={getTime(active, index)}
							/>
							<QuadrantDraggable
								index={index}
								result={results[index].tomorrow}
								type="tomorrow"
							/>
						</QuadrantDroppable>
					</DndContext>
				</div>
			</div>

			{!getTime(active, index) && index < results.length - 1 && (
				<hr className="-mx-7 my-2 border-2 border-gray-90" />
			)}
		</>
	)
}
