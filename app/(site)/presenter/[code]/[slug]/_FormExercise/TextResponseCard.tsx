import { Text } from "@/components/Text"
import type { TextFieldAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"

export const TextResponseCard = ({
	settings,
	answer,
	participantNumber,
	participant,
	field,
	questionNumber,
}: ResponseCardProps<TextFieldAnswer>) => {
	const name = settings.names
		? participant.name
		: `Participant ${participantNumber}`

	return (
		<ResponseDialog
			name={name}
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
