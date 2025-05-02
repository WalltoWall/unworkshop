import type { Colors } from "@/colors"
import { Button } from "@/components/Button"
import clsx from "clsx"
import { CheckIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

const bgs: Record<Colors.Variant, string> = {
	red: "var(--color-red-200)",
	orange: "var(--color-orange-200)",
	amber: "var(--color-amber-200)",
	yellow: "var(--color-yellow-200)",
	lime: "var(--color-lime-200)",
	green: "var(--color-green-200)",
	emerald: "var(--color-emerald-200)",
	teal: "var(--color-teal-200)",
	cyan: "var(--color-cyan-200)",
	sky: "var(--color-sky-200)",
	blue: "var(--color-blue-200)",
	indigo: "var(--color-indigo-200)",
	violet: "var(--color-violet-200)",
	purple: "var(--color-purple-200)",
	fuchsia: "var(--color-fuchsia-200)",
	pink: "var(--color-pink-200)",
	rose: "var(--color-rose-200)",
}

const borders: Record<Colors.Variant, string> = {
	red: "var(--color-red-300)",
	orange: "var(--color-orange-300)",
	amber: "var(--color-amber-300)",
	yellow: "var(--color-yellow-300)",
	lime: "var(--color-lime-300)",
	green: "var(--color-green-300)",
	emerald: "var(--color-emerald-300)",
	teal: "var(--color-teal-300)",
	cyan: "var(--color-cyan-300)",
	sky: "var(--color-sky-300)",
	blue: "var(--color-blue-300)",
	indigo: "var(--color-indigo-300)",
	violet: "var(--color-violet-300)",
	purple: "var(--color-purple-300)",
	fuchsia: "var(--color-fuchsia-300)",
	pink: "var(--color-pink-300)",
	rose: "var(--color-rose-300)",
}

const colors: Record<Colors.Variant, string> = {
	red: "var(--color-red-800)",
	orange: "var(--color-orange-800)",
	amber: "var(--color-amber-800)",
	yellow: "var(--color-yellow-800)",
	lime: "var(--color-lime-800)",
	green: "var(--color-green-800)",
	emerald: "var(--color-emerald-800)",
	teal: "var(--color-teal-800)",
	cyan: "var(--color-cyan-800)",
	sky: "var(--color-sky-800)",
	blue: "var(--color-blue-800)",
	indigo: "var(--color-indigo-800)",
	violet: "var(--color-violet-800)",
	purple: "var(--color-purple-800)",
	fuchsia: "var(--color-fuchsia-800)",
	pink: "var(--color-pink-800)",
	rose: "var(--color-rose-800)",
}

type NoteProps = {
	color: Colors.Variant
	placeholder?: string
	className?: string
	idx: number
	addNew: () => void
}

const SCALE_FACTOR = 0.04
const LIFT = 30
const OPACITY_FACTOR = 0.1

const Note = (props: NoteProps) => {
	const scale = 1 - SCALE_FACTOR * props.idx
	const y = -LIFT * props.idx
	const opacity = 1 - OPACITY_FACTOR * props.idx

	return (
		<motion.li
			style={{
				background: bgs[props.color],
				color: colors[props.color],
				borderColor: borders[props.color],
				zIndex: -props.idx,
			}}
			animate={{ scale, y, opacity }}
			transition={{ type: "spring", duration: 1, bounce: 0 }}
			initial={{ y: LIFT, opacity: 1 - OPACITY_FACTOR }}
			exit={{ scale: scale - SCALE_FACTOR, opacity: 0 }}
			className={clsx(
				"absolute inset-0 rounded-lg shadow-md font-semibold px-4 py-3 flex flex-col border gap-4 sm:py-4",
				props.className,
			)}
		>
			{props.idx === 0 && (
				<textarea
					className="resize-none grow outline-none sm:text-lg text-base"
					spellCheck={false}
					placeholder={props.placeholder}
				/>
			)}

			<Button
				className="ml-auto rounded-full mt-auto text-white"
				size="icon"
				onClick={props.addNew}
			>
				<span className="sr-only">Submit Sticky</span>
				<CheckIcon className="size-4" />
			</Button>
		</motion.li>
	)
}
Note.displayName = "Stickies.Note"

type StackProps = {
	className?: string
	children: React.ReactNode
}

const Stack = (props: StackProps) => {
	return (
		<ol
			className={clsx("aspect-square relative", props.className)}
			aria-live="polite"
		>
			<AnimatePresence>{props.children}</AnimatePresence>
		</ol>
	)
}
Stack.displayName = "Stickies.Stack"

export const Stickies = {
	Note,
	Stack,
}
