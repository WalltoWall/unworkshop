import { RichText, type RichTextContent } from "@/components/RichText"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { getTime } from "../QuadrantSteps"
import type { Answer } from "../types"

const serializers = {
	strong: ({ children }: { children?: string[] | React.ReactNode }) => (
		<strong className="text-indigo-68">{children}</strong>
	),
}

type QuadrantInstructionsProps = {
	active: number
	index: number
	answers: Answer[]
	todayInstructions?: ST["exercise"]["today_instructions"]
	tomorrowInstructions?: ST["exercise"]["tomorrow_instructions"]
	finalInstructions?: ST["exercise"]["finalize_instructions"]
}

export const QuadrantInstructions = ({
	active,
	index,
	answers,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
}: QuadrantInstructionsProps) => (
	<>
		{(getTime(active, index) !== false || index === 0) && (
			<div className="text-center">
				<div className="inline-flex content-center items-center rounded-2xl bg-gray-97 px-7 pb-6 pt-7">
					{getTime(active, index) === "today" ? (
						<div className="mr-2 h-8 w-8 flex-none rounded-full border-4 border-indigo-68" />
					) : getTime(active, index) === "tomorrow" ? (
						<div className="mr-2 h-8 w-8 flex-none rounded-full bg-indigo-68" />
					) : null}

					<Text style="heading" size={18} asChild>
						<h2>
							<RichText
								content={
									getTime(active, index) === "today"
										? (todayInstructions as RichTextContent)
										: answers.length > 0 && active === answers.length * 2
										? (finalInstructions as RichTextContent)
										: (tomorrowInstructions as RichTextContent)
								}
								components={{ ...serializers }}
							/>
						</h2>
					</Text>
				</div>
			</div>
		)}
	</>
)
