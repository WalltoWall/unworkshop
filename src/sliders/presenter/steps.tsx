import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cx } from "class-variance-authority"
import { useStep } from "@/lib/use-step"
import { text } from "@/styles/text"

type Props = {
	left: string
	right: string
	numSteps: number
	className?: string
}

export const PresenterSteps = (props: Props) => {
	const [step, setStep] = useStep()

	return (
		<div className={cx(props.className, "grid grid-cols-[1fr_auto_1fr]")}>
			<p className={text({ size: 40, style: "heading" })}>{props.left}</p>

			<div className="flex items-center justify-center gap-5 self-center">
				<button
					onClick={() => setStep(step - 1)}
					disabled={step === 1}
					className="text-black transition hover:text-neutral-700 disabled:text-neutral-300"
				>
					<span className="sr-only">Previous Slider</span>
					<ArrowLeftIcon className="size-7 text-neutral-500" />
				</button>

				<button
					onClick={() => setStep(step + 1)}
					disabled={step === props.numSteps}
					className="text-black transition hover:text-neutral-700 disabled:text-neutral-300"
				>
					<span className="sr-only">Next Slider</span>
					<ArrowRightIcon className="size-7" />
				</button>
			</div>

			<p
				className={text({
					size: 40,
					style: "heading",
					class: "justify-self-end",
				})}
			>
				{props.right}
			</p>
		</div>
	)
}
