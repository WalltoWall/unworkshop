"use client"
import Image from "next/image"
import { urlFor, altFor } from "@/sanity/field-helpers"

interface SliderItem {
	id: number
	key: any
	question_text: string
	left_value: string
	left_image?: unknown
	right_value: string
	right_image?: unknown
	_key: string
}

type Props = {
	sliders: Array<SliderItem>
}

export const SlidersExercise = ({ sliders }: Props) => {
	return (
        <div className="mt-8">
            {sliders.map((slider, index) => (
					<div key={slider._key}>
                        <div>
                            <p>{slider.question_text}</p>
                            <p>{slider.left_value}</p>
                            {slider.left_image?.asset && (
                                <Image
                                    src={urlFor(slider.left_image.asset).toString()}
                                    alt={altFor(slider.left_image)}
                                    className="w-full object-contain"
                                    width={300}
                                    height={300}
                                />
                            )}
                        </div>
                        <div>
                            <p>{slider.right_value}</p>
                            {slider.right_image?.asset && (
                                <Image
                                    src={urlFor(slider.right_image.asset).toString()}
                                    alt={altFor(slider.right_image)}
                                    className="w-full object-contain"
                                    width={300}
                                    height={300}
                                />
                            )}
                        </div>
                        <div className="slidecontainer">
                            <input type="range" min="1" max="6" value="3"/>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
