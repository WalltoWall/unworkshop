"use client"

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"
import { useDrag, useDrop } from "react-dnd"
import Image from "next/image"
import { cx } from "class-variance-authority"
import { RichText } from "@/components/RichText"
import { Text } from "@/components/Text"
import { altFor, urlFor } from "@/sanity/helpers"
import styles from "./QuadrantExercise.module.css"
import { getTime } from "./QuadrantsExercise"

const serializers = {
	strong: ({ children }: { children: React.ReactNode }) => (
		<strong className="text-indigo-68">{children}</strong>
	),
}

interface Point {
	top: number
	left: number
	placed: boolean
}

const DraggablePoint = ({ id, top, left, placed }: Point & { id: string }) => {
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: "time",
			item: { id, left, top, placed },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[id, left, top, placed],
	)

	const dotStyle = id === "today" ? "border-4 border-indigo-68" : "bg-indigo-68"
	const opacity = placed ? "opacity-1" : "opacity-0"

	return (
		<div
			ref={drag}
			className={`absolute left-0 top-0 -ml-4 -mt-4 h-8 w-8 rounded-full ${dotStyle} ${opacity} transition-opacity`}
			style={{
				top,
				left,
			}}
		/>
	)
}

export interface DragItem {
	type: string
	id: string
	top: number
	left: number
}

export interface QuadrantItem {
	id: number
	key: any
	today_instructions: Array<unknown>
	tomorrow_instructions: Array<unknown>
	finalize_instructions: Array<unknown>
	topValue: string
	bottomValue: string
	leftValue: string
	rightValue: string
	topLeftImage?: unknown
	topRightImage?: unknown
	bottomLeftImage?: unknown
	bottomRightImage?: unknown
	_key: string
}

type QuadrantProps = {
	item: QuadrantItem
	index: number
	active: number
	results: Array<unknown>
	setResults: Dispatch<
		SetStateAction<
			{
				today: {
					top: number
					left: number
					placed: boolean
				}
				tomorrow: {
					top: number
					left: number
					placed: boolean
				}
				arrow: {
					top: number
					left: number
					width: number
					angle: number
				}
			}[]
		>
	>
}

export const Quadrant = ({
	item,
	index,
	active,
	results,
	setResults,
}: QuadrantProps) => {
	const [opacity, setOpacity] = useState("opacity-0")
	const clickTarget = useRef(null)

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
			const newResults = [...results]
			newResults[index] = {
				...newResults[index],
				[id]: {
					top,
					left,
					placed: true,
				},
			}

			const points = newResults[index]
			newResults[index] = moveArrow(
				left,
				points.today?.left,
				top,
				points.today?.top,
				points,
			)

			setResults(newResults)
		},
		[results, setResults],
	)

	const moveArrow = (
		leftOne: number,
		leftTwo: number,
		topOne: number,
		topTwo: number,
		resultValue: unknown,
	) => {
		const arrowY = parseFloat(leftOne) - parseFloat(leftTwo)
		const arrowX = parseFloat(topOne) - parseFloat(topTwo)

		const arrowAngle =
			(Math.atan2(
				parseFloat(topOne) - parseFloat(topTwo),
				parseFloat(leftOne) - parseFloat(leftTwo),
			) *
				180) /
			Math.PI

		const arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)

		resultValue.arrow = {
			top: topTwo,
			left: leftTwo,
			width: `${arrowWidth}%`,
			angle: arrowAngle,
		}

		return resultValue
	}

	const [, drop] = useDrop(
		() => ({
			accept: "time",
			drop(item: DragItem, monitor) {
				const offset = monitor.getClientOffset()

				const parentRect = clickTarget.current.getBoundingClientRect()

				const top = `${
					((offset.y - parentRect.top) / clickTarget.current.clientHeight) * 100
				}%`
				const left = `${
					((offset.x - parentRect.left) / clickTarget.current.clientWidth) * 100
				}%`

				movePoint(item.id, left, top)

				return undefined
			},
		}),
		[moveArrow, movePoint],
	)

	const handleClick = (event) => {
		const parentRect = clickTarget.current.getBoundingClientRect()
		const time = getTime(active, index)

		const top = `${
			((event.clientY - parentRect.top) / clickTarget.current.clientHeight) *
			100
		}%`
		const left = `${
			((event.clientX - parentRect.left) / clickTarget.current.clientWidth) *
			100
		}%`

		if (time === "today") {
			movePoint("today", left, top)
		} else if (time === "tomorrow") {
			movePoint("tomorrow", left, top)
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
											? item.today_instructions
											: active === results.length * 2
											? item.finalize_instructions
											: item.tomorrow_instructions
									}
									components={{ ...serializers }}
								/>
							</h2>
						</Text>
					</div>
				</div>
			)}

			<div className="relative p-12">
				<h3 className="absolute left-0 top-5 w-full text-center text-gray-50">
					{item.topValue}
				</h3>
				<h3 className="absolute bottom-5 left-0 w-full text-center text-gray-50">
					{item.bottomValue}
				</h3>
				<h3 className="absolute bottom-0 left-11 w-full origin-bottom-left -rotate-90 text-center text-gray-50">
					{item.leftValue}
				</h3>
				<h3 className="absolute bottom-0 right-11 w-full origin-bottom-right rotate-90 text-center text-gray-50">
					{item.rightValue}
				</h3>

				<div
					ref={clickTarget}
					className="relative before:block before:pt-[100%]"
				>
					<div className="absolute left-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-r-2 border-gray-50">
						{item.topLeftImage?.asset && (
							<Image
								src={urlFor(item.topLeftImage)
									.width(150)
									.height(150)
									.format("webp")
									.toString()}
								alt={altFor(item.topLeftImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>
					<div className="absolute right-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-gray-50">
						{item.topRightImage?.asset && (
							<Image
								src={urlFor(item.topRightImage)
									.width(150)
									.height(150)
									.format("webp")
									.toString()}
								alt={altFor(item.topRightImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>
					<div className="absolute bottom-0 left-0 flex h-1/2 w-1/2 items-center justify-center border-r-2 border-gray-50">
						{item.bottomLeftImage?.asset && (
							<Image
								src={urlFor(item.bottomLeftImage)
									.width(150)
									.height(150)
									.format("webp")
									.toString()}
								alt={altFor(item.bottomLeftImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>
					<div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 items-center justify-center">
						{item.bottomRightImage?.asset && (
							<Image
								src={urlFor(item.bottomRightImage)
									.width(150)
									.height(150)
									.format("webp")
									.toString()}
								alt={altFor(item.bottomRightImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>

					<div
						ref={drop}
						className="absolute left-0 top-0 h-full w-full"
						onClick={handleClick}
					>
						{Object.keys(results[index]).map((key) => {
							const { left, top, placed } = results[index][key] as Point

							if (key === "arrow") return null

							return (
								<DraggablePoint
									key={key}
									id={key}
									left={left}
									top={top}
									placed={placed}
								/>
							)
						})}
					</div>

					<div
						className={cx(
							`absolute h-1 origin-left`,
							styles.arrowBetween,
							opacity,
						)}
						style={{
							top: results[index]?.arrow?.top,
							left: results[index]?.arrow?.left,
							width: results[index]?.arrow?.width,
							transform: `rotate(${results[index]?.arrow?.angle}deg)`,
						}}
					>
						<div className="bg-indigo-68"></div>
						<div className="border-l-indigo-68"></div>
					</div>
				</div>
			</div>

			{!getTime(active, index) && index < results.length - 1 && (
				<hr className="-mx-7 my-2 border-2 border-gray-90" />
			)}
		</>
	)
}
