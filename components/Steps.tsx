interface Props {
	count: number
	active: number
	onActiveChange: any
	onFinish: any
}

export const Steps = ({
	count,
	active = 0,
	onActiveChange,
	onFinish,
}: Props) => {
	if (!count) return null

	return (
		<div>
			<div></div>

			<button></button>

			<div></div>
		</div>
		// <ul className="flex items-center">
		// 	{[...Array(count)].map((_, i) => {
		// 		const completedClass = i <= active ? "bg-black" : "bg-gray-75"
		// 		const activeClass =
		// 			i === active ? "w-8 h-8 cursor-pointer" : "h-3 w-3 cursor-default"

		// 		return (
		// 			<li key={i}>
		// 				<button
		// 					className={`rounded-full ${activeClass} ${completedClass}`}
		// 					onClick={() => {
		// 						if (active === count - 1) {
		// 							onFinish()
		// 						} else if (i === active) {
		// 							onActiveChange(i + 1)
		// 						}
		// 					}}
		// 				></button>
		// 			</li>
		// 		)
		// 	})}
		// </ul>
	)
}
