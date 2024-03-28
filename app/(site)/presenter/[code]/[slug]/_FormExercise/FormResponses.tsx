"use client"

import React from "react"
import * as R from "remeda"
import snarkdown from "snarkdown"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/types.gen"
import type { FormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { useMultiplayerForm } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/use-multiplayer-form"
import { ResponseCard } from "./ResponseCard"

type Props = {
	exercise: ST["exercise"]
	participants: Record<string, FormParticipant>
}

export type FormPresenterViewSettings = {
	names: boolean
}

export const FormResponses = ({ exercise, participants }: Props) => {
	const groups = exercise.groups ?? []
	const [settings, setSettings] = React.useState<FormPresenterViewSettings>({
		names: groups.length > 1,
	})
	const { snap } = useMultiplayerForm({ exerciseId: exercise._id })

	const participantOrGroupAnswers = R.mapValues(
		snap.participants,
		(answers, id) => {
			const participant: FormParticipant | undefined = participants[id]
			const group = exercise.groups?.find((group) => group.slug.current === id)

			if (group) {
				return {
					answers,
					name: group.name,
					id: group.slug.current,
				}
			}

			return {
				answers,
				name: participant.name,
				id: participant._id,
			}
		},
	)

	// console.log(participantAnswers)

	// return null

	return (
		<>
			<div className="space-y-12 px-8 py-10">
				{exercise.form?.steps?.map((step, stepIdx) => {
					return (
						<div key={step._key}>
							<Text asChild style="heading" size={40}>
								<h2>Step {stepIdx + 1}</h2>
							</Text>

							{step.fields?.map((field, fieldIdx) => {
								const participantOrGroup = R.values(participantOrGroupAnswers)
									.map((pa) => ({
										answer: pa.answers.at(stepIdx)?.at(fieldIdx)!,
										name: pa.name,
										allAnswers: pa.answers,
										id: pa.id,
									}))
									.filter((val) => Boolean(val.answer))

								return (
									<div key={field._key} className="ml-8 mt-8">
										<div className="flex items-end gap-20">
											<Text asChild style="heading" size={32}>
												<h3>Question {fieldIdx + 1}</h3>
											</Text>

											<Text
												style="copy"
												size={16}
												dangerouslySetInnerHTML={{
													__html: snarkdown(field.prompt),
												}}
											/>
										</div>

										<div className="mt-7 flex flex-wrap gap-3">
											{participantOrGroup?.map((pOrG, idx) => (
												<ResponseCard
													key={pOrG.answer.type + idx}
													answer={pOrG.answer}
													allParticipantAnswers={
														participantOrGroupAnswers[pOrG.id].answers
													}
													name={pOrG.name}
													field={field}
													settings={settings}
													participantNumber={idx + 1}
													questionNumber={fieldIdx + 1}
												/>
											))}
										</div>
									</div>
								)
							})}
						</div>
					)
				})}
			</div>

			<SettingsMenu>
				<SettingVisibility
					isVisible={settings.names}
					label="Names"
					toggleVisibility={() =>
						setSettings((prev) => ({ ...prev, names: !prev.names }))
					}
				/>
			</SettingsMenu>
		</>
	)
}
