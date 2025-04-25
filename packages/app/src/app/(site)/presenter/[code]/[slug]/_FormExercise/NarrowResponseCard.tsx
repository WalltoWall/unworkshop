import { Text } from "@/components/Text"
import { HighlightedResponses } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/HighlightedResponses"
import type { NarrowFieldAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"

export const NarrowResponseCard = ({
	settings,
	answer,
	participantNumber,
	field,
	name,
	questionNumber,
	allParticipantAnswers,
}: ResponseCardProps<NarrowFieldAnswer>) => {
	const displayName = settings.names ? name : `Participant ${participantNumber}`

	const sourceStep = field.source?.step ?? Infinity
	const sourceField = field.source?.step ?? Infinity

	const sourceAnswer = allParticipantAnswers?.at(sourceStep)?.at(sourceField)

	if (sourceAnswer && sourceAnswer.type !== "List") {
		throw new Error(
			"Invalid source answer for Narrow exercise. Only 'List' types are supported.",
		)
	}

	return (
		<ResponseDialog
			name={displayName}
			field={field}
			questionNumber={questionNumber}
			trigger={
				<ul className="list-inside list-decimal space-y-1">
					{answer.responses.map((resp) => (
						<Text asChild style="copy" size={18} key={resp} trim={false}>
							<li>{resp}</li>
						</Text>
					))}
				</ul>
			}
		>
			<div className="flex h-full flex-col items-center justify-center gap-12">
				{sourceAnswer && (
					<HighlightedResponses
						responses={sourceAnswer.groups.at(0)?.responses ?? []}
						answers={answer.responses}
						size={16}
						className="w-full max-w-[40.625rem] items-center justify-center gap-3"
						invalidClassName="bg-black text-white"
						validClassName="bg-gray-90 opacity-50"
						itemClassName="p-4 rounded-xl"
					/>
				)}
				<ul className="list-inside list-decimal space-y-2">
					{answer.responses.map((resp) => (
						<Text
							key={resp}
							asChild
							size={40}
							className="mx-auto w-full max-w-[46rem]"
							trim={false}
						>
							<li>{resp}</li>
						</Text>
					))}
				</ul>
			</div>
		</ResponseDialog>
	)
}
