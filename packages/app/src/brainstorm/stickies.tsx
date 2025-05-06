import type { Colors } from "@/colors"
import clsx from "clsx"
import { AnimatePresence, motion, type MotionProps } from "motion/react"
import React from "react"
import { atom } from "nanostores"
import { useStore } from "@nanostores/react"

const $expanded = atom(false)

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
	onNoteChange?: (value: string) => void
	value?: string
}

const SCALE_FACTOR = 0.04
const LIFT = 30
const OPACITY_FACTOR = 0.1

const Note = (props: NoteProps) => {
	const expanded = useExpanded()
	const rTextArea = React.useRef<HTMLTextAreaElement>(null)
	const scale = 1 - SCALE_FACTOR * props.idx
	const y = -LIFT * props.idx
	const opacity = 1 - OPACITY_FACTOR * props.idx

	function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		props.onNoteChange?.(e.target.value)
	}

	const animate: MotionProps["animate"] = {
		scale: expanded ? 1 : scale,
		y: expanded ? 0 : y,
		opacity: expanded ? 1 : opacity,
	}

	const transition: MotionProps["transition"] = {
		type: "spring",
		bounce: expanded ? 0.05 : 0,
		duration: expanded ? 0.7 : 1,
	}

	return (
		<motion.li
			layout
			layoutDependency={expanded}
			style={{
				background: bgs[props.color],
				color: colors[props.color],
				borderColor: borders[props.color],
				zIndex: -props.idx,
			}}
			animate={animate}
			transition={transition}
			initial={{
				y: LIFT,
				opacity: 0.25,
				scale: 1 + SCALE_FACTOR,
			}}
			exit={{ scale: scale - SCALE_FACTOR, opacity: 0 }}
			className={clsx(
				"rounded-lg shadow-md font-semibold border",
				expanded ? "px-4 py-3" : "absolute inset-0 pl-4 pt-3 pb-10 pr-10",
				props.className,
			)}
		>
			{(props.idx === 0 || expanded) && (
				<motion.textarea
					layout="position"
					layoutDependency={expanded}
					ref={rTextArea}
					className="resize-none grow outline-none sm:text-lg text-base w-full h-full field-sizing-content"
					spellCheck={false}
					placeholder={expanded ? undefined : props.placeholder}
					value={props.value}
					onChange={onChange}
				/>
			)}
		</motion.li>
	)
}
Note.displayName = "Stickies.Note"

type StackProps = {
	className?: string
	children: React.ReactNode
}

const Stack = (props: StackProps) => {
	const expanded = useExpanded()
	const rContainer = React.useRef<HTMLDivElement>(null)
	const rOverlay = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		if (!expanded) return

		const collapseIfOutsideClick = (e: MouseEvent) => {
			if (e.target === rContainer.current || e.target === rOverlay.current)
				collapse()
		}

		const closeIfEscapeKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") collapse()
		}

		document.addEventListener("click", collapseIfOutsideClick, {
			passive: true,
		})
		document.addEventListener("keyup", closeIfEscapeKey, { passive: true })

		return () => {
			document.removeEventListener("click", collapseIfOutsideClick)
			document.removeEventListener("keyup", closeIfEscapeKey)
		}
	}, [expanded])

	return (
		<>
			<div
				ref={rOverlay}
				className={clsx(
					"duration-600 linear",
					expanded ? "fixed z-10 inset-0 bg-black opacity-50" : "opacity-0",
				)}
			/>

			<motion.div
				ref={rContainer}
				layoutRoot={expanded}
				className={clsx(
					expanded &&
						"fixed inset-0 overflow-auto h-svh z-20 overscroll-contain",
				)}
			>
				<ol
					className={clsx(
						expanded
							? "flex flex-col gap-4 max-w-[32rem] mx-auto justify-center py-8 px-4"
							: "aspect-square relative",
						props.className,
					)}
					aria-live="polite"
				>
					<AnimatePresence>{props.children}</AnimatePresence>
				</ol>
			</motion.div>
		</>
	)
}
Stack.displayName = "Stickies.Stack"

const useExpanded = () => useStore($expanded)
const expand = () => $expanded.set(true)
const collapse = () => $expanded.set(false)

export const Stickies = {
	Note,
	Stack,
	expand,
	collapse,
	useExpanded,
}
