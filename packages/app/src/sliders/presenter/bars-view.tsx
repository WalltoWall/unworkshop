import { cx } from "class-variance-authority"
import * as R from "remeda"
import styles from "./bars-view.module.css"
import { useSettings } from "./use-sliders-settings"

type Props = {
	answers: Array<{ today: number; tomorrow?: number }>
}

export const BarsView = (props: Props) => {
	const settings = useSettings()
	const totals = props.answers.reduce(
		(acc, curr) => {
			const tomorrow = curr.tomorrow ?? 0
			const today = curr.today ?? 0

			acc[today - 1].today++
			acc[tomorrow - 1].tomorrow++

			return acc
		},
		R.times(6, () => ({ today: 0, tomorrow: 0 })),
	)

	return (
		<>
			<div className="flex grow flex-col pb-6">
				<div className="flex grow justify-between pt-10">
					{totals.map((total, idx) => (
						<div key={idx} className="flex w-32 items-end gap-2">
							{settings.showToday && (
								<div
									className="bg-presenter relative min-h-4 w-full"
									style={{
										height: `${(total.today / props.answers.length) * 100}%`,
									}}
								>
									<span className="font-heading absolute -top-10 w-full text-center text-2xl">
										{total.today}
									</span>
								</div>
							)}

							{settings.showTomorrow && (
								<div
									className={cx(
										styles.tomorrowBars,
										"border-presenter relative min-h-4 w-full border-2 border-b-0 bg-white",
									)}
									style={{
										height: `${(total.tomorrow / props.answers.length) * 100}%`,
									}}
								>
									<span className="font-heading absolute -top-10 z-10 w-full text-center text-2xl">
										{total.tomorrow}
									</span>
								</div>
							)}
						</div>
					))}
				</div>

				<div className="h-2 bg-black" />
			</div>
		</>
	)
}
