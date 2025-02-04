import { motion } from "motion/react"
import { cx } from "class-variance-authority"
import { Legend } from "@/components/legend"
import styles from "./key.module.css"
import type { View } from "./use-view"

export const Key = (props: { view: View }) => {
	const isDots = props.view === "dots"

	return (
		<Legend.Root className="text-presenter flex flex-col gap-1 self-start">
			<div className="flex items-center gap-1.5">
				<motion.div
					className="bg-presenter size-6"
					animate={{ borderRadius: isDots ? "50%" : "0%" }}
				/>
				<Legend.Heading className="mb-0.5">Today</Legend.Heading>
			</div>

			<div className="flex items-center gap-1.5">
				<motion.div
					animate={{ borderRadius: isDots ? "50%" : "0%" }}
					className={cx(
						!isDots && styles.tomorrow,
						"border-presenter size-6 border-2 bg-white",
					)}
				/>
				<Legend.Heading className="mb-0.5">Tomorrow</Legend.Heading>
			</div>
		</Legend.Root>
	)
}
