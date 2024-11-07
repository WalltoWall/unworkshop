import React from "react"
import { cx } from "class-variance-authority"
import { motion, type PanInfo } from "framer-motion"
import throttle from "just-throttle"
import { showContributorWarning } from "@/lib/show-contributor-warning"
import { useGroupContext } from "@/groups/group-context"
import type {
	QuadrantStep,
	QuadrantStepAnswer,
	QuadrantStepState,
} from "../types"
import { Dot } from "./Dot"
import { QuadrantAxesAndImages } from "./QuadrantAxesAndImages"
import { QuadrantLabels } from "./QuadrantLabels"

const MotionDot = motion(Dot)

interface Props {
	quadrant: QuadrantStep
	className?: string
	readOnly: boolean
	state: QuadrantStepState
	stepIdx: number
	id: string
	stepAnswer?: QuadrantStepAnswer
}

export const Quadrant = ({
	quadrant,
	className,
	readOnly,
	state,
	stepIdx,
	id,
	stepAnswer,
}: Props) => {
	const { actions } = useGroupContext()
	const rContainer = React.useRef<HTMLDivElement>(null)

	const submitCoords = React.useCallback(
		(x: number, y: number, type: "today" | "tomorrow") => {
			if (!rContainer.current) throw new Error("Missing container ref.")

			const container = rContainer.current
			const rect = container.getBoundingClientRect()

			const top = ((y - rect.top) / container.clientHeight) * 100
			const left = ((x - rect.left) / container.clientWidth) * 100

			actions.send({
				type: "update-dot",
				top,
				left,
				dotType: type,
				stepIdx,
				id,
			})
		},
		[actions, id, stepIdx],
	)

	const onContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (state === "complete") return
		if (readOnly) return showContributorWarning()

		submitCoords(
			e.clientX,
			e.clientY,
			state === "today_pending" ? "today" : "tomorrow",
		)
	}

	return (
		<div className={cx(className, "relative aspect-square p-6")}>
			<QuadrantLabels
				top={quadrant.topValue}
				left={quadrant.leftValue}
				right={quadrant.rightValue}
				bottom={quadrant.bottomValue}
			/>
			<QuadrantAxesAndImages
				topLeftImage={quadrant.topLeftImage}
				topRightImage={quadrant.topRightImage}
				bottomLeftImage={quadrant.bottomLeftImage}
				bottomRightImage={quadrant.bottomRightImage}
			/>

			<div
				ref={rContainer}
				className="relative h-full w-full"
				onClick={onContainerClick}
			>
				{stepAnswer?.today && (
					<MotionDot
						variant="unfilled"
						className="absolute cursor-grab active:cursor-grabbing"
						style={{
							top: stepAnswer.today.top + "%",
							left: stepAnswer.today.left + "%",
						}}
					/>
				)}

				{stepAnswer?.tomorrow && (
					<MotionDot
						variant="filled"
						className="absolute cursor-grab active:cursor-grabbing"
						style={{
							top: stepAnswer.tomorrow.top + "%",
							left: stepAnswer.tomorrow.left + "%",
						}}
					/>
				)}
			</div>
		</div>
	)
}
