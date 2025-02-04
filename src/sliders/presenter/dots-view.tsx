import { CalendarIcon, CircleOffIcon, MoveRightIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React from "react"
import { cx } from "class-variance-authority"
import { Colors } from "@/colors"
import { Button } from "@/components/Button"
import { useStep } from "@/lib/use-step"
import type { Sliders } from "@/sanity/types.gen"

const Bar = () => <div className="bg-presenter h-20" />

const arrowCns = {
	left: "left-[17px] top-[-2.5px] origin-right border-b-[12px] border-r-[12px] border-t-[12px] border-b-transparent border-t-transparent",
	right:
		"right-[17px] top-[-2.5px] origin-left border-b-[12px] border-l-[12px] border-t-[12px] border-b-transparent border-t-transparent",
}

const Line = (props: {
	col: [start: number, end: number]
	row: [start: number, end: number]
}) => {
	const duration = 1.5
	const bounce = 0
	const delay = 0.65

	const colStart = Math.min(props.col[0], props.col[1])
	const colEnd = Math.max(props.col[0], props.col[1])

	const shouldShowArrow = colEnd !== colStart
	const arrowDirection = props.col[0] < props.col[1] ? "right" : "left"

	return (
		<motion.div
			className="relative h-full w-full"
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			style={{
				gridColumnStart: colStart,
				gridColumnEnd: colEnd + 1,
				gridRowStart: props.row[0],
				gridRowEnd: props.row[1],
			}}
		>
			<motion.svg
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				className="h-full w-full"
				style={{ rotate: arrowDirection === "left" ? 180 : 0 }}
			>
				<motion.line
					x1={0}
					x2={100}
					y1={50}
					y2={50}
					strokeWidth={20}
					className="stroke-presenter"
					initial={{ pathLength: 0 }}
					animate={{
						pathLength: 1,
						transition: { type: "spring", duration, bounce, delay },
					}}
					exit={{
						pathLength: 0,
						transition: { type: "spring", duration, bounce },
					}}
				/>
			</motion.svg>

			{shouldShowArrow && (
				<motion.div
					className={cx(
						"border-presenter absolute h-0 w-0",
						arrowCns[arrowDirection],
					)}
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{
						opacity: 1,
						scaleX: 1,
						transition: {
							type: "spring",
							delay: duration,
							bounce,
							duration: 0.25,
						},
					}}
					exit={{
						opacity: 0,
						scaleX: 0,
						transition: { scaleX: { duration: 0 } },
					}}
				/>
			)}
		</motion.div>
	)
}

type Props = {
	answers: Array<{ today: number; tomorrow?: number }>
}

export const DotsView = (props: Props) => {
	const [isTomorrow, setIsTomorrow] = React.useState(false)
	const [showLines, setShowLines] = React.useState(false)
	const [color] = Colors.useActive()

	return (
		<>
			<div className="flex grow flex-col pb-6" style={Colors.style(color, 300)}>
				<div
					className="grid grow grid-cols-[repeat(6,20px)] content-between gap-x-[calc((100%-120px)/5)] py-4"
					style={{ gridTemplateRows: `repeat(${props.answers.length}, 20px)` }}
				>
					<AnimatePresence>
						{showLines &&
							props.answers.map((answer, idx) => (
								<Line
									key={"line-" + idx}
									col={[answer.today, answer.tomorrow ?? answer.today]}
									row={[idx + 1, idx + 1]}
								/>
							))}

						{props.answers.map((answer, idx) => (
							<motion.div
								key={"dot-" + idx}
								layout
								layoutDependency={isTomorrow}
								className="border-presenter relative h-5 w-5 rounded-full border-3"
								initial={false}
								transition={{ type: "spring", duration: 2, bounce: 0.05 }}
								animate={{
									backgroundColor: isTomorrow
										? "var(--color-white)"
										: "var(--color-presenter)",
								}}
								style={{
									gridColumn: isTomorrow ? answer.tomorrow : answer.today,
									gridRow: idx + 1,
								}}
							/>
						))}

						{showLines &&
							props.answers.map((answer, idx) => (
								<motion.div
									key={"line-dot-" + idx}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0, transition: { delay: 0.25 } }}
									transition={{ duration: 0.25 }}
									className="border-presenter relative h-5 w-5 rounded-full border-[3px]"
									style={{
										backgroundColor: isTomorrow
											? "var(--color-black)"
											: "var(--color-presenter)",
										gridColumn: isTomorrow ? answer.today : answer.tomorrow,
										gridRow: idx + 1,
									}}
								/>
							))}
					</AnimatePresence>
				</div>

				<div className="relative -mb-8 grid grid-cols-[repeat(6,20px)] gap-x-[calc((100%-120px)/5)]">
					<Bar />
					<Bar />
					<Bar />
					<Bar />
					<Bar />
					<Bar />
				</div>

				<div className="h-2 bg-black" />
			</div>

			<div className="absolute top-0 right-0 flex min-w-48 flex-col gap-2">
				<Button
					onClick={() => setIsTomorrow((p) => !p)}
					disabled={showLines}
					className={cx(showLines ? "opacity-0" : "opacity-100")}
					size="md"
				>
					{isTomorrow ? "See Today" : "See Tomorrow"}
					<CalendarIcon className="mt-0.5 size-5" />
				</Button>

				<Button onClick={() => setShowLines((l) => !l)} size="md">
					{showLines ? (
						<>
							Hide Lines
							<CircleOffIcon className="mt-0.5 size-5" />
						</>
					) : (
						<>
							Show Lines
							<MoveRightIcon className="mt-0.5 size-5" />
						</>
					)}
				</Button>
			</div>
		</>
	)
}
