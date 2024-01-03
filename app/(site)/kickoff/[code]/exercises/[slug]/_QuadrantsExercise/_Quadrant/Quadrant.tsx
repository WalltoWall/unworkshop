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
	const [, startTransition] = React.useTransition()

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

	let arrowY = 0
	let arrowX = 0
	let arrowAngle = 0
	let arrowWidth = 0

	if (answer?.tomorrow && answer?.today) {
		arrowY = answer.tomorrow.left - answer.today.left
		arrowX = answer.tomorrow.top - answer.today.top
		arrowAngle = (Math.atan2(arrowX, arrowY) * 180) / Math.PI
		arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)
	}

	// const arrowY = tomorrowLeft - todayLeft
	// const arrowX = tomorrowTop - todayTop
	// const time = getTime(active, index)
	// const arrowOpacity =
	// 	(time === "tomorrow" || !time) && tomorrowPlaced
	// 		? "opacity-100"
	// 		: "opacity-0"

	// const arrowAngle = (Math.atan2(arrowX, arrowY) * 180) / Math.PI
	// const arrowWidth = Math.sqrt(arrowX * arrowX + arrowY * arrowY)

	const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
		if (clickTarget?.current) {
			const parentRect = clickTarget.current.getBoundingClientRect()
			const top =
				((event.clientY - parentRect.top) / clickTarget.current.clientHeight) *
				100
			const left =
				((event.clientX - parentRect.left) / clickTarget.current.clientWidth) *
				100

			let updatedAnswer = {
				name: item.name,
				newAnswer: {},
			}

			if (state === "today_pending" || state === "today_placed") {
				updatedAnswer.newAnswer = {
					today: { top, left },
					...tomorrow,
				}
			} else if (state === "tomorrow_pending" || state === "tomorrow_placed") {
				updatedAnswer.newAnswer = {
					...today,
					tomorrow: { top, left },
				}
			}

			startTransition(() => {
				answerDispatch(updatedAnswer)
			})

			onQuadrantClick()

			const handleSubmit = submitQuadrantAction.bind(null, {
				answer: updatedAnswer,
				exerciseId,
				isGroup,
			})
			await handleSubmit()
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

	return (
		<>
			<div className="relative my-6 p-7 md:p-12">
				<QuadrantAxes item={item} />

				<div
					ref={clickTarget}
					className="relative before:block before:pt-[100%]"
				>
					<QuadrantImages item={item} />

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

							<QuadrantArrow
								top={answer?.today?.top}
								left={answer?.today?.left}
								tomorrowPlaced={Boolean(answer?.tomorrow)}
								state={state}
								width={arrowWidth}
								angle={arrowAngle}
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
