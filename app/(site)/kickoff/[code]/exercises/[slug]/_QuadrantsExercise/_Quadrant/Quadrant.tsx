"use client"

import React, { useRef } from "react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import type { ST } from "@/sanity/config"
import { submitQuadrantAction } from "../actions"
import { getTime } from "../QuadrantSteps"
import type { Answer } from "../types"
import { QuadrantArrow } from "./QuadrantArrow"
import { QuadrantAxes } from "./QuadrantAxes"
import { QuadrantDraggable } from "./QuadrantDraggable"
import { QuadrantDroppable } from "./QuadrantDroppable"
import { QuadrantImages } from "./QuadrantImages"
import { QuadrantInstructions } from "./QuadrantInstructions"

type QuadrantProps = {
	item: NonNullable<ST["exercise"]["quadrants"]>[number]
	exerciseId: string
	isGroup: boolean
	index: number
	active: number
	answers: Answer[]
	answer?: Answer
	todayInstructions?: ST["exercise"]["today_instructions"]
	tomorrowInstructions?: ST["exercise"]["tomorrow_instructions"]
	finalInstructions?: ST["exercise"]["finalize_instructions"]
}

export const Quadrant = ({
	item,
	exerciseId,
	isGroup,
	index,
	active,
	answers,
	answer,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
}: QuadrantProps) => {
	const formRef = React.useRef<HTMLFormElement>(null)
	const [opacity, setOpacity] = React.useState("opacity-0")

	const [todayPlaced, setTodayPlaced] = React.useState(
		Boolean(answer?.today?.placed),
	)
	const [tomorrowPlaced, setTomorrowPlaced] = React.useState(
		Boolean(answer?.tomorrow?.placed),
	)
	const [todayTop, setTodayTop] = React.useState(answer?.today?.top ?? 0)
	const [todayLeft, setTodayLeft] = React.useState(answer?.today?.left ?? 0)
	const [tomorrowTop, setTomorrowTop] = React.useState(
		answer?.tomorrow?.top ?? 0,
	)
	const [tomorrowLeft, setTomorrowLeft] = React.useState(
		answer?.tomorrow?.left ?? 0,
	)
	const [arrowWidth, setArrowWidth] = React.useState(0)
	const [arrowAngle, setArrowAngle] = React.useState(0)

	const clickTarget = useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		const arrowY = tomorrowLeft - todayLeft
		const arrowX = tomorrowTop - todayTop

		const arrowAngle = (Math.atan2(arrowX, arrowY) * 180) / Math.PI
		const arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)

		setArrowAngle(arrowAngle)
		setArrowWidth(arrowWidth)

		const time = getTime(active, index)
		if ((time === "tomorrow" || !time) && tomorrowPlaced) {
			setOpacity("opacity-100")
		} else {
			setOpacity("opacity-0")
		}

		if (todayPlaced || tomorrowPlaced) {
			formRef.current?.requestSubmit()
		}
	}, [
		todayTop,
		todayLeft,
		tomorrowTop,
		tomorrowLeft,
		todayPlaced,
		tomorrowPlaced,
		active,
		index,
	])

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
				setTodayPlaced(true)
				setTodayTop(top)
				setTodayLeft(left)
			} else if (time === "tomorrow") {
				setTomorrowPlaced(true)
				setTomorrowTop(top)
				setTomorrowLeft(left)
			}
		}
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
					if (type === "today") {
						setTodayPlaced(true)
						setTodayTop(top)
						setTodayLeft(left)
					} else if (type === "tomorrow") {
						setTomorrowPlaced(true)
						setTomorrowTop(top)
						setTomorrowLeft(left)
					}
				}
			}
		}
	}

	return (
		<>
			<QuadrantInstructions
				active={active}
				index={index}
				answers={answers}
				todayInstructions={todayInstructions}
				tomorrowInstructions={tomorrowInstructions}
				finalInstructions={finalInstructions}
			/>
			<div className="relative p-7 md:p-12">
				<QuadrantAxes item={item} />

				<div
					ref={clickTarget}
					className="relative before:block before:pt-[100%]"
				>
					<QuadrantImages item={item} />

					<form
						action={submitQuadrantAction}
						ref={formRef}
						className="absolute left-0 top-0 h-full w-full"
					>
						<input type="hidden" name="exerciseId" value={exerciseId} />
						<input type="hidden" name="quadrantName" value={item.name} />
						<input
							type="checkbox"
							defaultChecked={isGroup}
							name="isGroup"
							className="hidden"
						/>
						<input
							type="number"
							className="hidden"
							name="todayTop"
							value={todayTop}
						/>
						<input
							type="number"
							className="hidden"
							name="todayLeft"
							value={todayLeft}
						/>
						<input
							type="checkbox"
							checked={todayPlaced}
							name="todayPlaced"
							className="hidden"
						/>
						<input
							type="number"
							className="hidden"
							name="tomorrowTop"
							value={tomorrowTop}
						/>
						<input
							type="number"
							className="hidden"
							name="tomorrowLeft"
							value={tomorrowLeft}
						/>
						<input
							type="checkbox"
							checked={tomorrowPlaced}
							name="tomorrowPlaced"
							className="hidden"
						/>

						<DndContext
							onDragEnd={handleDragEnd}
							onDragMove={() => setOpacity("opacity-0")}
						>
							<QuadrantDroppable index={index} onClick={handleClick}>
								<QuadrantDraggable
									index={index}
									top={todayTop}
									left={todayLeft}
									type="today"
									placed={todayPlaced}
								/>

								<QuadrantArrow
									top={todayTop}
									left={todayLeft}
									width={arrowWidth}
									angle={arrowAngle}
									opacity={opacity}
									time={getTime(active, index)}
								/>

								<QuadrantDraggable
									index={index}
									top={tomorrowTop}
									left={tomorrowLeft}
									type="tomorrow"
									placed={tomorrowPlaced}
								/>
							</QuadrantDroppable>
						</DndContext>
					</form>
				</div>
			</div>
		</>
	)
}
