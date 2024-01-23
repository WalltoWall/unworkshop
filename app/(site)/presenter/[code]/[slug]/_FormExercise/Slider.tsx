import React from "react"
import clsx from "clsx"
import { Text } from "@/components/Text"

type Props = {
	responses: string[]
}

export const Slider = ({ responses }: Props) => {
	const [idx, setIdx] = React.useState(0)
	const rObs = React.useRef<IntersectionObserver>()
	const rItems = React.useRef<HTMLElement[]>([])

	React.useEffect(() => {
		rObs.current ??= new IntersectionObserver((entries) => {
			const entry = entries.find((e) => e.isIntersecting)
			if (!entry) return

			const newIdx = rItems.current.findIndex((item) => item === entry.target)
			setIdx(newIdx)
		})

		rItems.current.forEach((item) => {
			if (!item) return

			rObs.current?.observe(item)
		})

		return () => rObs.current?.disconnect()
	}, [])

	return (
		<div className="relative flex grow flex-col justify-center">
			<ul className="scroll-shadow-x -m-9 flex snap-x snap-mandatory items-center gap-20 overflow-auto overscroll-contain p-9 text-center scrollbar-hide scroll-shadow-20">
				{responses.map((resp) => (
					<Text
						key={resp}
						asChild
						size={40}
						className="mx-auto w-full shrink-0 snap-center"
					>
						<li ref={(el) => rItems.current.push(el!)}>
							<div className="mx-auto w-full max-w-[46rem]">{resp}</div>
						</li>
					</Text>
				))}
			</ul>

			<div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-3">
				{responses.length > 1 &&
					responses.map((resp, i) => (
						<button
							key={resp}
							className={clsx(
								"h-4 w-4 rounded-full transition ease-out",
								idx === i ? "bg-black" : "bg-gray-90",
							)}
							onClick={() =>
								rItems.current.at(i)?.scrollIntoView({
									behavior: "smooth",
									block: "nearest",
									inline: "center",
								})
							}
						>
							<span className="sr-only">Go to answer {idx + 1}</span>
						</button>
					))}
			</div>
		</div>
	)
}
