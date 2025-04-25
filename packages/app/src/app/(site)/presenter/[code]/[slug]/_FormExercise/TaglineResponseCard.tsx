import React from "react"
import { Text } from "@/components/Text"
import { HighlightedResponses } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/HighlightedResponses"
import type { TaglineFieldAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { getTaglineVariant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/utils"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"
import { Slider } from "./Slider"

export const TaglineResponseCard = ({
	name,
	answer,
	allParticipantAnswers,
	field,
	settings,
	participantNumber,
	questionNumber,
}: ResponseCardProps<TaglineFieldAnswer>) => {
	if (!field.source?.step || !field.source.field) {
		throw new Error("Invalid tagline source field")
	}

	const sourceAnswer = allParticipantAnswers
		?.at(field.source.step - 1)
		?.at(field.source.field - 1)

	if (sourceAnswer?.type !== "List") {
		throw new Error("Invalid resolved tagline source answer.")
	}

	const variant = getTaglineVariant(field.color ?? "red")
	const displayName = settings.names ? name : `Participant ${participantNumber}`

	const words = sourceAnswer.groups.at(0)?.responses.filter(Boolean) ?? []
	const answers = answer.responses.filter(Boolean)

	return (
		<ResponseDialog
			name={displayName}
			field={field}
			questionNumber={questionNumber}
			trigger={
				<>
					<HighlightedResponses
						responses={words}
						answers={answers}
						size={14}
						className="mt-5"
						validClassName="bg-black text-white"
						invalidClassName={variant.invalidBgCn}
					/>

					<ul className="mt-6 flex flex-col gap-8">
						{answers.map((resp, idx) => (
							<Text key={idx} asChild size={18}>
								<li>{resp}</li>
							</Text>
						))}
					</ul>
				</>
			}
		>
			<div className="flex h-full flex-col items-center justify-between gap-12">
				<HighlightedResponses
					responses={words}
					answers={answers}
					size={16}
					className="w-full max-w-[40.625rem] items-center justify-center gap-3"
					validClassName="bg-black text-white"
					itemClassName="p-4 rounded-xl"
					invalidClassName={variant.invalidBgCn}
				/>

				<Slider.Container>
					{answers.map((resp, idx) => (
						<Slider.Slide key={idx}>
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
