import { cx } from "class-variance-authority"
import type { QuadrantStep } from "../types"
import { QuadrantAxesAndImages } from "./QuadrantAxesAndImages"
import { QuadrantLabels } from "./QuadrantLabels"

interface Props {
	quadrant: QuadrantStep
	className?: string
}

export const Quadrant = ({ quadrant, className }: Props) => {
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
		</div>
	)
}
