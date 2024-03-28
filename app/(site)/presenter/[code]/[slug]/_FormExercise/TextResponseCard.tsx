import { Text } from "@/components/Text"
import type { TextFieldAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"

export const TextResponseCard = ({
	settings,
	answer,
	participantNumber,
	name,
	field,
	questionNumber,
}: ResponseCardProps<TextFieldAnswer>) => {
	const displayName = settings.names ? name : `Participant ${participantNumber}`

	return (
		<ResponseDialog
			name={displayName}
			field={field}
			questionNumber={questionNumber}
			trigger={
				<Text asChild style="copy" size={18}>
					<h5>{answer.response}</h5>
				</Text>
			}
		>
			<div className="flex h-full flex-col items-center justify-center gap-12">
				<Text size={40} className="mx-auto w-full max-w-[46rem] text-center">
					{answer.response}
				</Text>
			</div>
		</ResponseDialog>
	)
}
