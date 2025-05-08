import { motion, spring, type MotionProps } from "motion/react"
import React from "react"
import { getRouteApi, Link, useParams, useSearch } from "@tanstack/react-router"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { match, P } from "ts-pattern"
import { slugify } from "@/lib/slugify"
import { useDialog } from "@/lib/use-dialog"
import { text } from "@/styles/text"
import type { Exercise } from "@/type-helpers"
import styles from "./nav-sheet.module.css"

const route = getRouteApi("/_authenticated/presenter_/$code")

type StepLinkProps = {
	code: string
	exerciseSlug: string
	step: number
	onClick: () => void
}

const StepLink = (props: StepLinkProps) => {
	const search = useSearch({ strict: false })
	const params = useParams({ strict: false })

	const activeStep = search.step ?? 1

	const active =
		params.code === props.code &&
		props.exerciseSlug === params.exerciseSlug &&
		activeStep === props.step

	return (
		<li>
			<Link
				to="/presenter/$code/$exerciseSlug"
				params={{ code: props.code, exerciseSlug: props.exerciseSlug }}
				search={{ step: props.step }}
				className={text({
					style: "heading",
					size: 24,
					class:
						"opacity-50 transition hover:opacity-100 focus:opacity-100 data-[active=true]:opacity-100",
				})}
				onClick={props.onClick}
				data-active={active}
			>
				Step {props.step}
			</Link>
		</li>
	)
}

interface HamburgerProps extends React.ComponentProps<"button"> {
	open: boolean
}

const Hamburger = ({ open, className, ...props }: HamburgerProps) => {
	const duration = 0.4
	const transition: MotionProps["transition"] = {
		y: { duration, delay: open ? 0 : 0.2, type: "spring" },
		rotate: {
			duration,
			delay: open ? 0.2 : 0,
			type: "spring",
		},
	}

	return (
		<button
			data-hamburger
			className={cx(className, "group flex flex-col gap-2")}
			{...props}
		>
			<motion.span
				className={cx(
					open
						? "bg-black group-hover:bg-white"
						: "group-hover:bg-brand bg-white",
					"h-1 w-6 rounded-xs transition-colors",
				)}
				animate={{
					y: open ? 6 : 0,
					rotate: open ? 45 : 0,
				}}
				transition={transition}
			/>
			<motion.span
				className={cx(
					open
						? "bg-black group-hover:bg-white"
						: "group-hover:bg-brand bg-white",
					"h-1 w-6 rounded-xs transition-colors",
				)}
				animate={{
					y: open ? -6 : 0,
					rotate: open ? -45 : 0,
				}}
				transition={transition}
			/>
		</button>
	)
}

type Props = {
	exercises: Array<{ name: string; type: Exercise["type"]; steps: number }>
}

const easing = spring({
	keyframes: [0, 1],
	visualDuration: 0.3,
	bounce: 0.05,
})
const style = { "--easing": easing.toString() } as React.CSSProperties

export const NavSheet = (props: Props) => {
	const [open, setOpen] = React.useState(false)
	const params = route.useParams()
	const rDialog = React.useRef<HTMLDialogElement>(null)

	useDialog({ open, setOpen, ref: rDialog })

	const closeMenu = () => setOpen(false)

	function toggleNavVisibility() {
		setOpen((o) => !o)
	}

	return (
		<>
			<Hamburger open={open} onClick={toggleNavVisibility} />

			<dialog
				className={cx(
					"fixed inset-y-0 right-0 min-w-96 bg-amber-300 px-6 pt-24 pb-6 text-black shadow-md",
					"backdrop:fixed backdrop:inset-0 backdrop:bg-black/40 backdrop:backdrop-blur-[2px]",
					styles.dialog,
				)}
				ref={rDialog}
				style={style}
			>
				<Hamburger
					open={open}
					onClick={toggleNavVisibility}
					className="absolute top-9 right-5"
				/>
				<nav>
					<ul className="flex flex-col gap-10">
						{props.exercises.map((e) => (
							<li key={e.name} className="flex flex-col gap-4">
								<Link
									to="/presenter/$code/$exerciseSlug"
									params={{ code: params.code, exerciseSlug: slugify(e.name) }}
									className={text({
										style: "heading",
										size: 48,
										class:
											"inline-block pb-1 uppercase underline-offset-8 hover:underline",
									})}
									onClick={closeMenu}
								>
									{e.name}
								</Link>

								{match(e)
									.with({ type: P.union("brainstorm", "sliders") }, (e) => (
										<ul className="flex flex-col gap-1 pl-6">
											{R.range(0, e.steps).map((idx) => (
												<StepLink
													key={idx}
													code={params.code}
													exerciseSlug={slugify(e.name)}
													onClick={closeMenu}
													step={idx + 1}
												/>
											))}
										</ul>
									))
									.otherwise(() => null)}
							</li>
						))}
					</ul>
				</nav>
			</dialog>
		</>
	)
}
