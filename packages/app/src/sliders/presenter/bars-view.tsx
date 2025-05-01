import { cx } from "class-variance-authority"
import * as R from "remeda"
import styles from "./bars-view.module.css"
import { getRouteApi } from "@tanstack/react-router"
import { motion, type Transition } from "motion/react"
import { Button } from "@/components/Button"
import { ChartColumnBigIcon } from "lucide-react"

type Props = {
	answers: Array<{ today: number; tomorrow?: number }>
}

const route = getRouteApi("/_authenticated/presenter_/$code/$exerciseSlug")

export const BarsView = (props: Props) => {
	const { sliders } = route.useSearch()
	const navigate = route.useNavigate()
	const totals = props.answers.reduce(
		(acc, curr) => {
			const tomorrow = curr.tomorrow ?? 0
			const today = curr.today ?? 0

			const buckets = {
				today: acc[today - 1],
				tomorrow: acc[tomorrow - 1],
			}

			if (buckets.today) buckets.today.today++
			if (buckets.tomorrow) buckets.tomorrow.tomorrow++

			return acc
		},
		R.times(6, () => ({ today: 0, tomorrow: 0 })),
	)

	const transition: Transition = {
		type: "spring",
		stiffness: 65,
		damping: 15,
		mass: 1,
	}

	const getHeight = (total: number) =>
		`${(total / props.answers.length) * 100}%`

	const cycleShowState = () => {
		if (sliders.show === "both") {
			return navigate({
				search: (p) => ({ ...p, sliders: { ...p.sliders, show: "today" } }),
			})
		}

		if (sliders.show === "today") {
			return navigate({
				search: (p) => ({ ...p, sliders: { ...p.sliders, show: "tomorrow" } }),
			})
		}

		if (sliders.show === "tomorrow") {
			return navigate({
				search: (p) => ({ ...p, sliders: { ...p.sliders, show: "both" } }),
			})
		}
	}

	const buttonLabel =
		sliders.show === "both"
			? "Show Today"
			: sliders.show === "today"
				? "Show Tomorrow"
				: "Show Both"

	return (
		<>
			<div className="flex grow flex-col pb-6">
				<div className="flex grow justify-between pt-10">
					{totals.map((total, idx) => (
						<div key={idx} className="flex w-32 items-end gap-2">
							{(sliders.show === "both" || sliders.show === "today") && (
								<motion.div
									className="bg-presenter relative min-h-4 w-full"
									animate={{ height: getHeight(total.today) }}
									transition={transition}
								>
									<span className="font-heading absolute -top-10 w-full text-center text-2xl">
										{total.today}
									</span>
								</motion.div>
							)}

							{(sliders.show === "both" || sliders.show === "tomorrow") && (
								<motion.div
									className={cx(
										styles.tomorrowBars,
										"border-presenter relative min-h-4 w-full border-2 border-b-0 bg-white",
									)}
									animate={{ height: getHeight(total.tomorrow) }}
									transition={transition}
								>
									<span className="font-heading absolute -top-10 z-10 w-full text-center text-2xl">
										{total.tomorrow}
									</span>
								</motion.div>
							)}
						</div>
					))}
				</div>

				<div className="h-2 bg-black" />
			</div>

			<div className="absolute top-0 right-0 flex min-w-48 flex-col gap-2">
				<Button size="md" onClick={cycleShowState}>
					{buttonLabel}
					<ChartColumnBigIcon className={cx("mt-0.5 size-5")} />
				</Button>
			</div>
		</>
	)
}
