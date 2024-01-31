"use client"

import React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import type {
	Answer,
	SlidersParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import { useMultiplayerSliders } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/use-multiplayer-sliders"
import { SlidersBars } from "./SlidersBars"
import { SlidersKey } from "./SlidersKey"

interface PresenterViewProps {
	exercise: ST["exercise"]
	participantId: string
	allParticipants: Array<SlidersParticipant>
}

export const SlidersPresenterViewClient = ({
	exercise,
	participantId,
	allParticipants,
}: PresenterViewProps) => {
	const [color, setColor] = React.useState("#fecb2f")

	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const { snap, actions } = useMultiplayerSliders({
		exerciseId: exercise._id,
		stepIdx,
		participantId,
	})

	const answers = actions.getAllAnswers({ participants: allParticipants })

	return exercise.sliders ? (
		<div>
			<SlidersKey />
			{exercise.sliders.map((slider) => (
				<div key={slider._key} className="relative mb-6 mt-12 w-full">
					<div className="h-[50vh] w-full overflow-hidden rounded-t-3xl border-b-[0.666rem] border-black">
						{isFilled.image(slider.left_image) &&
							isFilled.image(slider.right_image) && (
								<div className="flex h-full w-full bg-black">
									{isFilled.image(slider.left_image) && (
										<div className="w-full">
											<Image
												src={urlFor(slider.left_image).url()!}
												alt={altFor(slider.left_image)}
												className="h-full w-full object-cover object-center opacity-50"
												width={300}
												height={300}
											/>
										</div>
									)}
									{isFilled.image(slider.right_image) && (
										<div className="w-full">
											<Image
												src={urlFor(slider.right_image).url()!}
												alt={altFor(slider.right_image)}
												className="h-full w-full object-cover object-center opacity-50"
												width={300}
												height={300}
											/>
										</div>
									)}
								</div>
							)}

						<SlidersBars
							answers={answers}
							images={
								isFilled.image(slider.left_image) &&
								isFilled.image(slider.right_image)
							}
						/>
					</div>

					<div className="mt-10 flex w-full items-end justify-between">
						<Text className="ml-1 uppercase text-40 font-heading capsize">
							{slider.left_value}
						</Text>
						<Text className="ml-1 uppercase text-40 font-heading capsize">
							{slider.right_value}
						</Text>
					</div>
				</div>
			))}
		</div>
	) : null
}

export default SlidersPresenterViewClient
