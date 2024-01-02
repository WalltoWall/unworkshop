import React from "react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import type { ST } from "@/sanity/config"
import { submitQuadrantAction } from "../actions"
import { type AnswerDispatch, type State } from "../QuadrantSteps"
import type { Answer } from "../types"
import { QuadrantArrow } from "./QuadrantArrow"
import { QuadrantAxes } from "./QuadrantAxes"
import { QuadrantDraggable } from "./QuadrantDraggable"
import { QuadrantDroppable } from "./QuadrantDroppable"
import { QuadrantImages } from "./QuadrantImages"

type QuadrantProps = {
	item: NonNullable<ST["exercise"]["quadrants"]>[number]
	exerciseId: string
	isGroup: boolean
	index: number
	state: State
	answer?: Answer
	answerDispatch: (action: AnswerDispatch) => void
	onQuadrantClick: () => void
}

// REVIEW: I wonder if it's okay that participants are able to modify the
// "tomorrow" circle when they are on the "today" step and vice-versa. Probably
// something we want to run-by the larger team during review.
//
// REVIEW: 1/2 – Instead of using a <form> element, maybe we can just call the
// server action directly and provide it a normal JS object/JSON to prevent us
// from needing to create a bunch of input elements. That lets us rely on the
// answer to derive `today` and `tomorrow` instead of managing it in React
// state.
//
// See: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#passing-additional-arguments
export const Quadrant = ({
	item,
	exerciseId,
	isGroup,
	index,
	state,
	answer,
	answerDispatch,
	onQuadrantClick,
}: QuadrantProps) => {
	// const formRef = React.useRef<HTMLFormElement>(null)
	const [isPending, startTransition] = React.useTransition()

	const today = answer?.today
	const tomorrow = answer?.tomorrow

	// const [arrowWidth, setArrowWidth] = React.useState(0)
	// const [arrowAngle, setArrowAngle] = React.useState(0)

	const clickTarget = React.useRef<HTMLDivElement>(null)

	// React.useEffect(() => {
	// 	if (!answer) {
	// 		formRef.current?.requestSubmit()
	// 	}
	// }, [answer])

	// REVIEW: We can just derive the arrow properties directly, no need for
	// useEffect.
	// const arrowY = tomorrowLeft - todayLeft
	// const arrowX = tomorrowTop - todayTop
	// const time = getTime(active, index)
	// const arrowOpacity =
	// 	(time === "tomorrow" || !time) && tomorrowPlaced
	// 		? "opacity-100"
	// 		: "opacity-0"

	// const arrowAngle = (Math.atan2(arrowX, arrowY) * 180) / Math.PI
	// const arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)

	// REVIEW: I think it may be simpler to explicitly submit the form in our
	// event handlers directly. I understand that this was probably the result
	// of the fact that state updates in React aren't "synchronous" in the sense
	// that the DOM doesn't immediately update after you call a setState.
	//
	// I think the ideal solution here would be to use the `useOptimistic` hook
	// to update the result of a form mutation immediately, and fallback to the
	// server result as needed and avoid state altogether:
	//
	// https://react.dev/reference/react/useOptimistic
	//
	// Alternatively, you can use the `flushSync` method to run any form
	// submissions synchronously or just run the action without the <form />
	// entirely.
	//
	// https://react.dev/reference/react-dom/flushSync
	// React.useEffect(() => {
	// 	if (todayPlaced || tomorrowPlaced) {
	// 		formRef.current?.requestSubmit()
	// 	}
	// }, [todayPlaced, tomorrowPlaced])

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (clickTarget?.current) {
			const parentRect = clickTarget.current.getBoundingClientRect()
			const top =
				((event.clientY - parentRect.top) / clickTarget.current.clientHeight) *
				100
			const left =
				((event.clientX - parentRect.left) / clickTarget.current.clientWidth) *
				100

			startTransition(() => {
				if (state === "today_pending" || state === "today_placed") {
					answerDispatch({
						name: item.name,
						newAnswer: {
							today: { top, left },
							...tomorrow,
						},
					})
				} else if (
					state === "tomorrow_pending" ||
					state === "tomorrow_placed"
				) {
					answerDispatch({
						name: item.name,
						newAnswer: {
							...today,
							tomorrow: { top, left },
						},
					})
				}
			})

			handleSubmit()
			onQuadrantClick()
		}
	}

	const handleDragEnd = (event: DragEndEvent) => {
		if (clickTarget?.current) {
			const { type, ref } = event.active.data.current!
			const parentRect = clickTarget.current.getBoundingClientRect()

			if (ref) {
				var pointRect = ref.getBoundingClientRect()
				let top =
					((pointRect.top + 16 - parentRect.top) /
						clickTarget.current.clientHeight) *
					100
				let left =
					((pointRect.left + 16 - parentRect.left) /
						clickTarget.current.clientWidth) *
					100

				top = top > 100 ? 100 : top < 0 ? 0 : top
				left = left > 100 ? 100 : left < 0 ? 0 : left

				if (state === "today_pending" || state === "today_placed") {
					setToday({
						top,
						left,
						placed: true,
					})
				} else if (
					state === "tomorrow_pending" ||
					state === "tomorrow_placed"
				) {
					setTomorrow({
						top,
						left,
						placed: true,
					})
				}
			}
		}
	}

	const handleSubmit = async () => {
		await submitQuadrantAction.bind(null, answer)
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

					{/* <form
						action={handleSubmit}
						ref={formRef}
						className="absolute left-0 top-0 h-full w-full"
					> */}
					{/* <input
							type="hidden"
							name="exerciseId"
							value={exerciseId}
							readOnly
						/>
						<input
							type="hidden"
							name="quadrantName"
							value={item.name}
							readOnly
						/>
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
							value={today.top}
							readOnly
						/>
						<input
							type="number"
							className="hidden"
							name="todayLeft"
							value={today.left}
							readOnly
						/>
						<input
							type="checkbox"
							checked={today.placed}
							name="todayPlaced"
							className="hidden"
							readOnly
						/>
						<input
							type="number"
							className="hidden"
							name="tomorrowTop"
							value={tomorrow.top}
							readOnly
						/>
						<input
							type="number"
							className="hidden"
							name="tomorrowLeft"
							value={tomorrow.left}
							readOnly
						/>
						<input
							type="checkbox"
							checked={tomorrow.placed}
							name="tomorrowPlaced"
							className="hidden"
							readOnly
						/> */}

					<DndContext
						onDragEnd={handleDragEnd}
						// REVIEW: This breaks since we moved the opacity
						// out of state, but I do think that the arrow would ideally update as the tomorrow handle drags in real-time.
						// onDragMove={() => setOpacity("opacity-0")}
					>
						<QuadrantDroppable index={index} onClick={handleClick}>
							{today && (
								<QuadrantDraggable
									index={index}
									top={today.top}
									left={today.left}
									type="today"
								/>
							)}

							{/* <QuadrantArrow
									top={today.top}
									left={today.left}
									width={arrowWidth}
									angle={arrowAngle}
									opacity={arrowOpacity}
									time={time}
								/> */}

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
					{/* </form> */}
				</div>
			</div>
		</>
	)
}
