import clsx from "clsx"
import { ArrowRight } from "@/components/icons/ArrowRight"
import { Text } from "@/components/Text"

export const Prompt = (props: {
	num: number
	children: string
	additionalText?: string
	className?: string
}) => {
	return (
		<div className={clsx("flex items-start gap-2", props.className)}>
			<div className="flex -translate-y-px items-center gap-0.5 text-gray-50">
				<Text asChild style="heading" size={16}>
					<p>{props.num}</p>
				</Text>

				<ArrowRight className="w-[13px]" />
			</div>

			<div className="space-y-3">
				<Text asChild size={16} style="copy">
					<h2>{props.children}</h2>
				</Text>

				{props.additionalText && (
					<Text size={12} className="text-gray-50">
						{props.additionalText}
					</Text>
				)}
			</div>
		</div>
	)
}
