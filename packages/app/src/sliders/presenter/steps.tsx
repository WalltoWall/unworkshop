import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cx } from "class-variance-authority"
import { text } from "@/styles/text"
import { getRouteApi, Link } from "@tanstack/react-router"

type Props = {
	left: string
	right: string
	numSteps: number
	className?: string
}

const route = getRouteApi("/_authenticated/presenter_/$code/$exerciseSlug")

export const PresenterSteps = (props: Props) => {
	const { step } = route.useSearch()

	return (
		<div className={cx(props.className, "grid grid-cols-[1fr_auto_1fr]")}>
			<p className={text({ size: 40, style: "heading" })}>{props.left}</p>

			<div className="flex items-center justify-center gap-5 self-center">
				<Link
					to="."
					search={(p) => ({ ...p, step: step - 1 })}
					disabled={step === 1}
					className="hover:text-presenter text-black transition aria-disabled:text-neutral-300"
				>
					<span className="sr-only">Previous Slider</span>
					<ArrowLeftIcon className="size-7" />
				</Link>

				<Link
					to="."
					search={(p) => ({ ...p, step: step + 1 })}
					disabled={step === props.numSteps}
					className="hover:text-presenter text-black transition aria-disabled:text-neutral-300"
				>
					<span className="sr-only">Next Slider</span>
					<ArrowRightIcon className="size-7" />
				</Link>
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
