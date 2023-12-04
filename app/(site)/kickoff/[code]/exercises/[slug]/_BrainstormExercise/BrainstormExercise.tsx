import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { CardScroller } from "./CardScroller"
import type { BrainstormParticipant } from "./types"

export interface BrainstormExerciseProps {
	exercise: ST["exercise"]
}

export const BrainstormExercise = async ({
	exercise,
}: BrainstormExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()
	const cards = participant.answers?.[exercise._id]?.answers ?? []
	const groups = exercise.groups ?? []
	const steps = exercise.steps

	return (
		<div className="mt-4 flex h-full flex-col">
			{/* {steps && steps.at(step - 1) && (
				<div>
					<h4 className="max-w-[16rem] text-16 leading-[1.4] font-sans capsize">
						{steps.at(step - 1)?.prompt}
					</h4>
					<p className="mt-5 text-gray-50 text-12 leading-[1.5] font-sans capsize">
						{steps.at(step - 1)?.helpText}
					</p>
				</div>
			)} */}

			<CardScroller
				cards={cards}
				exerciseId={exercise._id}
				group={groups.length > 0}
			/>
		</div>
	)
}
