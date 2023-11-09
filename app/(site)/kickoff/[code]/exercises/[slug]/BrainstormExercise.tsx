"use client"

import React from "react"

export interface BrainstormExerciseProps {
	steps: Array<{
		helpText: string | undefined
		_key: string | undefined
		prompt: string | undefined
	}>
}

export const BrainstormExercise = ({ steps }: BrainstormExerciseProps) => {
	const [step, setStep] = React.useState<number>(1)

	return (
		<div>
			{steps.at(step - 1) && (
				<div>
					<h4 className="text-16 leading-[1.4] font-sans">
						{steps.at(step - 1)?.prompt}
					</h4>
					<p className="font-sans">{steps.at(step - 1)?.helpText}</p>
				</div>
			)}
		</div>
	)
}
