import snarkdown from "snarkdown"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { type FormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { ResponseCard } from "./ResponseCard"

type Props = {
	exercise: ST["exercise"]
}

export const FormPresenterView = async ({ exercise }: Props) => {
	const participants =
		await client.findAllParticipantsInExercise<FormParticipant>(exercise._id)

	return (
		<div className="space-y-12 px-8 py-6">
			{exercise.form?.steps?.map((step, stepIdx) => {
				return (
					<div key={step._key}>
						<Text asChild style="heading" size={40}>
							<h2>Step {stepIdx + 1}</h2>
						</Text>

						{step.fields?.map((field, fieldIdx) => {
							const participantWithAnswer = participants
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

									<ul className="wrap mt-7 flex gap-8">
										{participantWithAnswer?.map((p, idx) => (
											<ResponseCard
												key={p.answer.type + idx}
												answer={p.answer}
												participant={p.participant}
												field={field}
												exerciseId={exercise._id}
											/>
										))}
									</ul>
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
