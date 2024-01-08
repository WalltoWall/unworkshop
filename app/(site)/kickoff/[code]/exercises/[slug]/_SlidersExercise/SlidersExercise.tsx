"use client"

import { useState } from "react"
import Image from "next/image"
import type { ST } from "@/sanity/config"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import { cx } from "class-variance-authority"
import { Slider } from "./Slider"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]
type Props = {
	exercise: ST["exercise"]
}

export const SlidersExercise = ({ exercise }: Props) => {
	const [value, setValue] = useState(0)
	const groups = exercise.groups ?? []

	return (
		<div className="mt-8">
			{exercise.sliders?.map((slider) => (
				<Slider 
					key={slider._key} 
					item={slider} 
					exerciseId={exercise._id}
					group={groups.length > 0} />
			))}
		</div>
	)
}
