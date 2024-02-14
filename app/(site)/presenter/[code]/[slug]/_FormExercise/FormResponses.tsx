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
	const [settings, setSettings] = React.useState<FormPresenterViewSettings>({
		names: false,
	})
	const { snap, multiplayer } = useMultiplayerForm({ exerciseId: exercise._id })

	if (!multiplayer.provider.synced) return null

	const participantAnswers = R.mapValues(snap.participants, (answers, id) => ({
		answers,
		participant: participants[id],
	}))

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
								const participantWithAnswer = R.values(participantAnswers)
									.map((pa) => ({
										answer: pa.answers.at(stepIdx)?.at(fieldIdx)!,
										participant: pa.participant,
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
											{participantWithAnswer?.map((p, idx) => (
												<ResponseCard
													key={p.answer.type + idx}
													answer={p.answer}
													allParticipantAnswers={
														participantAnswers[p.participant._id].answers
													}
													participant={p.participant}
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
