"use client"

import { DndProvider, useDrop, useDrag } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Text } from "@/components/Text"
import { RichText } from "@/components/RichText"
import Image from "next/image"
import { urlFor, altFor } from "@/sanity/field-helpers"
import { useCallback, useEffect, useRef, useState } from "react"
import { Steps } from "@/components/Steps"
import styles from "./QuadrantExercise.module.css"

interface Point {
	top: number
	left: number
	placed: boolean
}
interface Points {
	[key: string]: Point
}
export interface DragItem {
	type: string
	id: string
	top: number
	left: number
}

interface QuadrantItem {
	id: number
	key: any
	today_instructions: any
	tomorrow_instructions: any
	topValue: string
	bottomValue: string
	leftValue: string
	rightValue: string
	topLeftImage?: any
	topRightImage?: any
	bottomLeftImage?: any
	bottomRightImage?: any
	_key: string
}

type Props = {
	quadrants: Array<QuadrantItem>
}

type QuadrantProps = {
	item: QuadrantItem
	index: number
	active: number
	results: Array<unknown>
	setResults: unknown
}

const getTime = (active, index) => {
	if (active === index * 2) {
		return "today"
	} else if (active === index * 2 + 1) {
		return "tomorrow"
	}

	return false
}

const serializers = {
	strong: (props) => (
		<strong className="text-indigo-68">{props.children}</strong>
	),
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

const Quadrant = ({
	item,
	index,
	active,
	results,
	setResults,
}: QuadrantProps) => {
	const [points, setPoints] = useState<Points>({
		today: { top: 0, left: 0, placed: false },
		tomorrow: { top: 0, left: 0, placed: false },
	})
	const arrowBetween = useRef(null)
	const clickTarget = useRef(null)

	const movePoint = useCallback(
		(id: string, left: number, top: number) => {
			setPoints({
				...points,
				[id]: {
					top,
					left,
					placed: true,
				},
			})

			if (id === "today") {
				moveArrow(id, points.tomorrow?.left, left, points.tomorrow?.top, top)
			} else {
				moveArrow(id, left, points.today?.left, top, points.today?.top)
			}
		},
		[points, setPoints],
	)

	const moveArrow = (
		id: string,
		leftOne: number,
		leftTwo: number,
		topOne: number,
		topTwo: number,
	) => {
		if (id === "tomorrow") {
			arrowBetween.current.style.opacity = 1
		}

		const arrowY = parseFloat(leftOne) - parseFloat(leftTwo)
		const arrowX = parseFloat(topOne) - parseFloat(topTwo)

		const arrowAngle =
			(Math.atan2(
				parseFloat(topOne) - parseFloat(topTwo),
				parseFloat(leftOne) - parseFloat(leftTwo),
			) *
				180) /
			Math.PI

		arrowBetween.current.style.left = leftTwo
		arrowBetween.current.style.top = topTwo

		const arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)

		arrowBetween.current.style.width = `${arrowWidth}%`
		arrowBetween.current.style.transform = `rotate(${arrowAngle}deg)`
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
			<div className="mx-auto flex max-w-[255px] content-center items-center rounded-2xl bg-gray-97 px-7 pb-6 pt-7">
				{getTime(active, index) === "today" ? (
					<div className="mr-2 h-8 w-8 flex-none rounded-full border-4 border-indigo-68" />
				) : (
					<div className="mr-2 h-8 w-8 flex-none rounded-full bg-indigo-68" />
				)}
				<Text style="heading" size={18} asChild>
					<h2 className="mt-1">
						<RichText
							content={
								getTime(active, index) === "today"
									? item.today_instructions
									: item.tomorrow_instructions
							}
							components={{ ...serializers }}
						/>
					</h2>
				</Text>
			</div>

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
								src={urlFor(item.topLeftImage.asset).toString()}
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
								src={urlFor(item.topRightImage.asset).toString()}
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
								src={urlFor(item.bottomLeftImage.asset).toString()}
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
								src={urlFor(item.bottomRightImage.asset).toString()}
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
						{Object.keys(points).map((key) => {
							const { left, top, placed } = points[key] as Point
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
						ref={arrowBetween}
						className={`${styles.arrowBetween} absolute h-1 origin-left opacity-0`}
					>
						<div className="bg-indigo-68"></div>
						<div className="border-l-indigo-68"></div>
					</div>
				</div>
			</div>
		</>
	)
}

export const QuadrantsExercise = ({ quadrants }: Props) => {
	const [results, setResults] = useState([])
	const [active, setActive] = useState(0)
	if (!quadrants) return null

	return (
		<div className="mt-8">
			<DndProvider backend={HTML5Backend}>
				{quadrants.map((quadrant, index) => (
					<div key={quadrant._key}>
						{(getTime(active, index) === "today" ||
							getTime(active, index) === "tomorrow") && (
							<Quadrant
								item={quadrant}
								index={index}
								active={active}
								results={results}
								setResults={setResults}
							/>
						)}
					</div>
				))}

				<Steps
					count={quadrants.length * 2}
					active={active}
					onActiveChange={setActive}
					onFinish={() => alert("done")}
				/>
			</DndProvider>
		</div>
	)
}
