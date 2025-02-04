"use client"

import type { UrlObject } from "node:url"
import * as D from "@radix-ui/react-dialog"
import { AnimatePresence, motion, type MotionProps } from "motion/react"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { match } from "ts-pattern"
import { slugify } from "@/lib/slugify"
import { useKickoffParams } from "@/lib/use-kickoff-params"
import { useStep } from "@/lib/use-step"
import { text } from "@/styles/text"
import type { Exercise } from "@/type-helpers"

type StepLinkProps = {
	href: UrlObject
	step: number
	onClick: () => void
}

const StepLink = (props: StepLinkProps) => {
	const [step] = useStep()
	const pathname = usePathname()

	const active = pathname === props.href.href && step === props.step

	return (
		<li>
			<Link
				href={props.href}
				className={text({
					style: "heading",
					size: 24,
					class:
						"opacity-50 transition hover:opacity-100 focus:opacity-100 data-[active=true]:opacity-100",
				})}
				onClick={props.onClick}
				data-active={active}
				shallow
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
		<button className={cx(className, "group flex flex-col gap-2")} {...props}>
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
	exercises: Array<{ name: string; type: Exercise["_type"]; steps: number }>
}

export const NavSheet = (props: Props) => {
	const [open, setOpen] = React.useState(false)
	const params = useKickoffParams()

	const closeMenu = () => setOpen(false)

	return (
		<D.Root open={open} onOpenChange={setOpen}>
			<D.Trigger asChild>
				<Hamburger open={open} />
			</D.Trigger>

			<D.Portal forceMount>
				<AnimatePresence>
					{open && (
						<D.Overlay forceMount asChild key="overlay">
							<motion.div
								className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
								initial={{ opacity: 0 }}
								exit={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							/>
						</D.Overlay>
					)}
					{open && (
						<D.Content forceMount asChild key="content">
							<motion.div
								className="fixed inset-y-0 right-0 min-w-96 bg-amber-300 px-6 pt-24 pb-6 text-black shadow-md"
								initial={{ x: "100%" }}
								exit={{ x: "100%" }}
								animate={{ x: "0%" }}
								transition={{ type: "spring", bounce: 0, duration: 0.4 }}
							>
								<D.Close className="absolute top-9 right-7" asChild>
									<Hamburger open={open} />
								</D.Close>

								<D.Title className="sr-only">Navigation</D.Title>
								<D.Description className="sr-only">
									Jump around to various presenter views.
								</D.Description>

								<nav>
									<ul className="flex flex-col gap-10">
										{props.exercises.map((e) => (
											<li key={e.name} className="flex flex-col gap-4">
												<Link
													className={text({
														style: "heading",
														size: 48,
														class:
															"inline-block pb-1 uppercase underline-offset-8 hover:underline",
													})}
													onClick={closeMenu}
													href={`/presenter/${params.code}/${slugify(e.name)}`}
												>
													{e.name}
												</Link>

												{match(e)
													.with({ type: "sliders" }, (e) => (
														<ul className="flex flex-col gap-1 pl-6">
															{R.range(0, e.steps).map((idx) => (
																<StepLink
																	key={idx}
																	href={{
																		href: `/presenter/${params.code}/${slugify(e.name)}`,
																		query: { step: idx + 1 },
																	}}
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
							</motion.div>
						</D.Content>
					)}
				</AnimatePresence>
			</D.Portal>
		</D.Root>
	)
}
