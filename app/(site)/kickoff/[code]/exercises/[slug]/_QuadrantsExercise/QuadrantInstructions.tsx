import { RichText, type RichTextContent } from "@/components/RichText"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/types.gen"
import { type State } from "./QuadrantsClient"

const serializers = {
	strong: ({ children }: { children?: string[] | React.ReactNode }) => (
		<strong className="text-indigo-68">{children}</strong>
	),
}

type QuadrantInstructionsProps = {
	state: State
	todayInstructions?: ST["exercise"]["today_instructions"]
	tomorrowInstructions?: ST["exercise"]["tomorrow_instructions"]
	finalInstructions?: ST["exercise"]["finalize_instructions"]
}

export const QuadrantInstructions = ({
	state,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
}: QuadrantInstructionsProps) => (
	<div className="text-center">
		<div className="inline-flex content-center items-center rounded-2xl bg-gray-97 px-7 pb-6 pt-7">
			{state === "today_pending" || state === "today_placed" ? (
				<div className="mr-2 h-8 w-8 flex-none rounded-full border-4 border-indigo-68" />
			) : state === "tomorrow_pending" || state === "tomorrow_placed" ? (
				<div className="mr-2 h-8 w-8 flex-none rounded-full bg-indigo-68" />
			) : null}

			<Text style="heading" size={18} asChild>
				<h2>
					<RichText
						content={
							state === "today_pending" || state === "today_placed"
								? (todayInstructions as RichTextContent)
								: state === "complete"
									? (finalInstructions as RichTextContent)
									: (tomorrowInstructions as RichTextContent)
						}
						components={{ ...serializers }}
					/>
				</h2>
			</Text>
		</div>
	</div>
)
