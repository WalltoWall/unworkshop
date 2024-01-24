import React from "react"
import { Text } from "@/components/Text"
import { HighlightedResponses } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/HighlightedResponses"
import type { TaglineFieldAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"
import { Slider } from "./Slider"

export const TaglineResponseCard = ({
	participant,
	answer,
	exerciseId,
	field,
	settings,
	participantNumber,
	questionNumber,
}: ResponseCardProps<TaglineFieldAnswer>) => {
	if (!field.source?.step || !field.source.field) {
		throw new Error("Invalid tagline source field")
	}

	const sourceAnswer = participant.answers?.[exerciseId]?.steps
		.at(field.source.step - 1)
		?.data.at(field.source.field - 1)

	if (!sourceAnswer || sourceAnswer.type !== "List") {
		throw new Error("Invalid resolved tagline source answer.")
	}

	const name = settings.names
		? participant.name
		: `Participant ${participantNumber}`

	return (
		<ResponseDialog
			name={name}
			field={field}
			questionNumber={questionNumber}
			trigger={
				<>
					<HighlightedResponses
						responses={sourceAnswer.groups.at(0)?.responses ?? []}
						answers={answer.responses}
						size={14}
						className="mt-5"
						validClassName="bg-black text-white"
					/>

					<ul className="mt-6 space-y-8">
						{answer.responses.map((resp) => (
							<Text key={resp} asChild size={18}>
								<li>{resp}</li>
							</Text>
						))}
					</ul>
				</>
			}
		>
			<div className="flex h-full flex-col items-center justify-between gap-12">
				<HighlightedResponses
					responses={sourceAnswer.groups.at(0)?.responses ?? []}
					answers={answer.responses}
					size={16}
					className="w-full max-w-[40.625rem] items-center justify-center gap-3"
					validClassName="bg-black text-white"
					itemClassName="p-4 rounded-xl"
				/>

				<Slider.Container>
					{answer.responses.map((resp) => (
						<Slider.Slide key={resp}>
							<Text
								size={40}
								className="mx-auto w-full max-w-[46rem] text-center"
							>
								{resp}
							</Text>
						</Slider.Slide>
					))}
				</Slider.Container>
			</div>
		</ResponseDialog>
	)
}
