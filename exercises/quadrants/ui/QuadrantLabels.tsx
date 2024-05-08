interface Props {
	top: string
	left: string
	right: string
	bottom: string
}

export const QuadrantLabels = (props: Props) => {
	return (
		<>
			<h3 className="pointer-events-none absolute inset-x-6 top-0 h-6 text-center text-gray-50">
				{props.top}
			</h3>
			<h3 className="pointer-events-none absolute inset-x-6 bottom-0 h-6 text-center text-gray-50">
				{props.bottom}
			</h3>
			<h3 className="pointer-events-none absolute bottom-0 left-0 h-6 w-[calc(100%-3rem)] origin-top-left -rotate-90 text-center text-gray-50">
				{props.left}
			</h3>
			<h3 className="pointer-events-none absolute bottom-0 right-0 h-6 w-[calc(100%-3rem)] origin-top-right rotate-90 text-center text-gray-50">
				{props.right}
			</h3>
		</>
	)
}
