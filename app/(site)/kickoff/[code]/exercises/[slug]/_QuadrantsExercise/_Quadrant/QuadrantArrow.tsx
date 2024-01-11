interface QuadrantArrowProps {
	top?: number
	left?: number
	tomorrowPlaced: boolean
	width: number
	angle: number
}

export const QuadrantArrow = ({
	top,
	left,
	tomorrowPlaced,
	width,
	angle,
}: QuadrantArrowProps) => {
	return top && left && tomorrowPlaced ? (
		<div
			className="absolute h-1 origin-left"
			style={{
				top: `${top}%`,
				left: `${left}%`,
				width: `${width}%`,
				transform: `rotate(${angle}deg)`,
			}}
		>
			<div className="absolute -top-[0.0625rem] left-[0.875rem] h-1 w-[calc(100%-1.875rem)] bg-indigo-68" />
			<div className="absolute -top-[0.6875rem] right-3 h-0 w-0 border-y-[0.75rem] border-l-[1.5rem] border-y-transparent border-l-indigo-68" />
		</div>
	) : null
}
