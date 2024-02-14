import React from "react"
import {
	DndContext,
	type DragEndEvent,
	type DragMoveEvent,
} from "@dnd-kit/core"
import type { ST } from "@/sanity/types.gen"
import { type State } from "../QuadrantsClient"
import type { Answer } from "../types"
import type { QuadrantsActions } from "../use-multiplayer-quadrants"
import { QuadrantArrow } from "./QuadrantArrow"
import { QuadrantAxes } from "./QuadrantAxes"
import { QuadrantDraggable } from "./QuadrantDraggable"
import { QuadrantDroppable } from "./QuadrantDroppable"
import { QuadrantImages } from "./QuadrantImages"

type Day = "today" | "tomorrow"

type QuadrantProps = {
	item: NonNullable<ST["exercise"]["quadrants"]>[number]
	index: number
	state: State
	answer?: Answer
	actions: QuadrantsActions
	onQuadrantClick: () => void
	readOnly?: boolean
}

// REVIEW: I wonder if it's okay that participants are able to modify the
// "tomorrow" circle when they are on the "today" step and vice-versa. Probably
// something we want to run-by the larger team during review.
export const Quadrant = ({
	item,
	index,
	state,
	answer,
	actions,
	onQuadrantClick,
	readOnly = false,
}: QuadrantProps) => {
	const [arrowData, setArrowData] = React.useState({
		top: 0,
		left: 0,
		angle: 0,
		width: 0,
	})

	const today = answer?.today
	const tomorrow = answer?.tomorrow

	const clickTarget = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		if (tomorrow && today) {
			const arrowY = tomorrow.left - today.left
			const arrowX = tomorrow.top - today.top

			setArrowData({
				top: today.top,
				left: today.left,
				angle: (Math.atan2(arrowX, arrowY) * 180) / Math.PI,
				width: Math.sqrt(arrowX * arrowX + arrowY * arrowY),
			})
		}
	}, [today, tomorrow])

	const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
		if (clickTarget?.current && !readOnly) {
			const parentRect = clickTarget.current.getBoundingClientRect()

			const top =
				((event.clientY - parentRect.top) / clickTarget.current.clientHeight) *
				100
			const left =
				((event.clientX - parentRect.left) / clickTarget.current.clientWidth) *
				100

			let type = "today" as Day
			if (state === "tomorrow_pending" || state === "tomorrow_placed") {
				type = "tomorrow"
			}

			await actions.setPointValue({
				slug: item.slug.current,
				day: type,
				top,
				left,
			})
			onQuadrantClick()
		}
	}

	const handleDragEnd = async (event: DragEndEvent) => {
		if (clickTarget?.current && !readOnly) {
			const { ref, type } = event.active.data.current!
			if (ref) {
				const [top, left] = getLocationsDuringDrag(ref, clickTarget.current)

				await actions.setPointValue({
					slug: item.slug.current,
					day: type,
					top,
					left,
				})
				onQuadrantClick()
			}
		}
	}

	const handleDragMove = (event: DragMoveEvent) => {
		if (clickTarget?.current && !readOnly) {
			const { ref, type } = event.active.data.current!
			if (ref && today && tomorrow) {
				const [top, left] = getLocationsDuringDrag(ref, clickTarget.current)
				if (type === "today") {
					const arrowY = tomorrow.left - left
					const arrowX = tomorrow.top - top
					setArrowData({
						top: top,
						left: left,
						angle: (Math.atan2(arrowX, arrowY) * 180) / Math.PI,
						width: Math.sqrt(arrowX * arrowX + arrowY * arrowY),
					})
				} else if (type === "tomorrow") {
					const arrowY = left - today.left!
					const arrowX = top - today.top!
					setArrowData({
						top: today.top,
						left: today.left,
						angle: (Math.atan2(arrowX, arrowY) * 180) / Math.PI,
						width: Math.sqrt(arrowX * arrowX + arrowY * arrowY),
					})
				}
			}
		}
	}

	const getLocationsDuringDrag = (ref: any, target: HTMLDivElement) => {
		const parentRect = target.getBoundingClientRect()
		const pointRect = ref.getBoundingClientRect()

		let top =
			((pointRect.top + 16 - parentRect.top) / target.clientHeight) * 100
		let left =
			((pointRect.left + 16 - parentRect.left) / target.clientWidth) * 100

		top = top > 100 ? 100 : top < 0 ? 0 : top
		left = left > 100 ? 100 : left < 0 ? 0 : left

		return [top, left]
	}

	return (
		<>
			<div className="relative my-6 p-7 md:p-12">
				<QuadrantAxes item={item} />

				<div
					ref={clickTarget}
					className="relative before:block before:pt-[100%]"
				>
					<QuadrantImages item={item} />

					<DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
						<QuadrantDroppable index={index} onClick={handleClick}>
							{today && (
								<QuadrantDraggable
									index={index}
									top={today.top}
									left={today.left}
									type="today"
								/>
							)}

							<QuadrantArrow
								top={arrowData.top}
								left={arrowData.left}
								tomorrowPlaced={Boolean(tomorrow)}
								width={arrowData.width}
								angle={arrowData.angle}
							/>

							{tomorrow && (
								<QuadrantDraggable
									index={index}
									top={tomorrow.top}
									left={tomorrow.left}
									type="tomorrow"
								/>
							)}
						</QuadrantDroppable>
					</DndContext>
				</div>
			</div>
		</>
	)
}
