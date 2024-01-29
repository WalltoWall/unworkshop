"use client"

import React from "react"
import snarkdown from "snarkdown"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { type FormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { ResponseCard } from "./ResponseCard"

type Props = {
	exercise: ST["exercise"]
	participants: FormParticipant[]
}

export type FormPresenterViewSettings = {
	names: boolean
}

export const FormResponses = ({ exercise, participants }: Props) => {
	const [settings, setSettings] = React.useState<FormPresenterViewSettings>({
		names: false,
	})

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
								const participantWithAnswer = participants
									.filter((p) => Boolean(p.answers?.[exercise._id].steps))
									.map((p) => ({
										answer: p.answers?.[exercise._id].steps
											.at(stepIdx)
											?.data.at(fieldIdx)!,
										participant: p,
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
													participant={p.participant}
													field={field}
													exerciseId={exercise._id}
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
