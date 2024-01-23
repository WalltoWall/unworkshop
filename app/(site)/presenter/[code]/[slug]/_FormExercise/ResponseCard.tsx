"use client"

import * as Dialog from "@radix-ui/react-dialog"
import React from "react"
import { match } from "ts-pattern"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"
import { HighlightedResponses } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/HighlightedResponses"
import type {
	FormField,
	FormFieldAnswer,
	FormParticipant,
	ListFieldAnswer,
	NarrowFieldAnswer,
	TaglineFieldAnswer,
	TextFieldAnswer,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import type { FormPresenterViewSettings } from "./FormResponses"
import { Slider } from "./Slider"

const ListResponseCard = ({
	settings,
	answer,
	participantNumber,
	participant,
}: ResponseCardProps<ListFieldAnswer>) => {
	const name = settings.names
		? participant.name
		: `Participant ${participantNumber}`

	return (
		<div className="max-w-[25rem] rounded-2xl bg-gray-90 p-5">
			<Text asChild style="heading" size={24}>
				<h4>{name}</h4>
			</Text>

			{answer.groups.map((g, idx) => (
				<div key={idx}>
					{g.label && (
						<Text asChild style="heading" size={18}>
							<h5>{g.label}</h5>
						</Text>
					)}

					<HighlightedResponses
						className="mt-5"
						responses={g.responses}
						answers={[]}
						size={14}
						validClassName="bg-black text-white"
					/>
				</div>
			))}
		</div>
	)
}

const NarrowResponseCard = (props: ResponseCardProps<NarrowFieldAnswer>) => {
	return <div>response field answer</div>
}

const TextResponseCard = (props: ResponseCardProps<TextFieldAnswer>) => {
	return <div>text field answer</div>
}

const TaglineResponseCard = ({
	participant,
	answer,
	exerciseId,
	field,
	settings,
	participantNumber,
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
		<Dialog.Root>
			<Dialog.Trigger className="max-w-[25rem] rounded-2xl bg-gray-90 p-5 text-left">
				<Text asChild style="heading" size={24}>
					<h4>{name}</h4>
				</Text>

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
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex min-h-[46.25rem] w-[min(67rem,100%-2.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between gap-12 rounded-[23px] bg-white px-9 py-14">
					<Dialog.Close className="absolute right-9 top-14 h-8 w-8">
						<span className="sr-only">Close</span>
						<BlackXIcon className="h-8 w-8" />
					</Dialog.Close>

					<HighlightedResponses
						responses={sourceAnswer.groups.at(0)?.responses ?? []}
						answers={answer.responses}
						size={16}
						className="mt-5 w-full max-w-[40.625rem] items-center justify-center gap-3"
						validClassName="bg-black text-white"
						itemClassName="p-4 rounded-xl"
					/>

					<Slider responses={answer.responses} />

					<Dialog.Title>
						<Text style="heading" size={32}>
							{name}
						</Text>
					</Dialog.Title>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

type ResponseCardProps<T extends FormFieldAnswer = FormFieldAnswer> = {
	answer: T
	participant: FormParticipant
	field: FormField
	exerciseId: string
	settings: FormPresenterViewSettings
	participantNumber: number
}

export const ResponseCard = (props: ResponseCardProps) => {
	return match(props.answer)
		.with({ type: "List" }, (answer) => (
			<ListResponseCard {...props} answer={answer} />
		))
		.with({ type: "Narrow" }, (answer) => (
			<NarrowResponseCard {...props} answer={answer} />
		))
		.with({ type: "Text" }, (answer) => (
			<TextResponseCard {...props} answer={answer} />
		))
		.with({ type: "Tagline" }, (answer) => (
			<TaglineResponseCard {...props} answer={answer} />
		))
		.exhaustive()
}
