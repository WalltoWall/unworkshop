import clsx from "clsx"
import { Text, type TextVariants } from "@/components/Text"
import { sanitizeString } from "./utils"

type Props = {
	responses: string[]
	answers: string[]
	className?: string
	size?: TextVariants["size"]
	validClassName?: string
	invalidClassName?: string
	itemClassName?: string
}

export const HighlightedResponses = ({
	answers,
	responses,
	className,
	size = 12,
	validClassName = "bg-gray-90",
	invalidClassName = "bg-red-63",
	itemClassName,
}: Props) => {
	const cleanAnswers = answers.map(sanitizeString)

	return (
		<ul className={clsx(className, "flex flex-wrap gap-2")}>
			{responses.map((resp) => {
				const cleanResp = sanitizeString(resp)
				const invalid = cleanAnswers.some((a) => a.includes(cleanResp))

				return (
					<Text
						asChild
						key={resp}
						size={size}
						style="copy"
						className={clsx(
							"rounded-lg p-3",
							itemClassName,
							invalid ? invalidClassName : validClassName,
						)}
					>
						<li>{resp}</li>
					</Text>
				)
			})}
		</ul>
	)
}
