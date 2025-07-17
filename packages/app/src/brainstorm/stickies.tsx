import { XMarkIcon } from "@heroicons/react/16/solid"
import { useStore } from "@nanostores/react"
import clsx from "clsx"
import { AnimatePresence, type MotionProps, motion } from "motion/react"
import { atom } from "nanostores"
import React from "react"
import { Colors } from "@/colors"
import { Button } from "@/components/Button"

const MotionButton = motion.create(Button)
const $expanded = atom(false)

type NoteProps = {
	color: Colors.Variant
	placeholder?: string
	className?: string
	idx: number
	onNoteChange?: (value: string) => void
	onNoteDelete?: () => void
	value?: string
	ref?: React.Ref<HTMLLIElement>
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
		bounce: expanded ? 0 : 0,
		duration: expanded ? 0.35 : 0.7,
	}

	const initial: MotionProps["initial"] = {
		y: expanded ? 0 : LIFT,
		opacity: expanded ? 1 : 0.25,
		scale: expanded ? 1 : 1 + SCALE_FACTOR,
	}
	const exit = {
		scale: scale - SCALE_FACTOR,
		opacity: 0,
		transition: expanded
			? { duration: 0.2, type: "spring", bounce: 0 }
			: transition,
	}

	return (
		<motion.li
			layout
			ref={props.ref}
			style={{
				...Colors.stickyStyle(props.color),
				zIndex: -props.idx,
			}}
			animate={animate}
			transition={transition}
			initial={initial}
			exit={exit}
			className={clsx(
				"rounded-lg shadow-md font-semibold border",
				expanded
					? "px-4 py-3 relative snap-start max-w-[30rem] w-full"
					: "absolute inset-0 pl-4 pt-3 pb-10 pr-10",
				props.className,
			)}
		>
			{(props.idx === 0 || expanded) && (
				<motion.textarea
					layout="position"
					ref={rTextArea}
					className="resize-none grow outline-none sm:text-lg text-base w-full h-full field-sizing-content"
					spellCheck={false}
					placeholder={expanded ? undefined : props.placeholder}
					value={props.value}
					onChange={onChange}
					autoFocus={!expanded}
				/>
			)}
			{expanded && (
				<MotionButton
					className="absolute -top-2 -right-2"
					onClick={props.onNoteDelete}
					size="iconSm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.35 }}
				>
					<span className="sr-only">Submit sticky</span>
					<XMarkIcon className="size-3.5" />
				</MotionButton>
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
	const rContainer = React.useRef<HTMLOListElement>(null)
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

			<ol
				ref={rContainer}
				className={clsx(
					expanded
						? "flex flex-col gap-4 p-4 h-svh z-20 overscroll-contain overflow-auto fixed inset-0 snap-y snap-mandatory items-center scroll-pt-4"
						: "aspect-square relative",
					props.className,
				)}
				aria-live="polite"
			>
				<AnimatePresence mode="popLayout">{props.children}</AnimatePresence>
			</ol>
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
