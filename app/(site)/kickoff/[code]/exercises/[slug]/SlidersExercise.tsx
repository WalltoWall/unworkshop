"use client"
import Image from "next/image"
import { urlFor, altFor } from "@/sanity/field-helpers"
import { useState, useEffect, useRef } from "react"
// import { Steps } from "@/components/Steps"

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
    const progressRef = useRef(null)
    const [setValue, useValue] = useState(0)

	return (
        <div className="mt-8">
            {/* <h3>{useValue}</h3> */}
            {sliders.map((slider, index) => (
					<div className="p-4 bg-gray-97 rounded-lg" key={slider._key}>
                        <h3>{slider.question_text}</h3>
                        
                        <div className="relative my-3 h-32 rounded-lg overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 bottom-0 h-32">
                                {slider.left_image?.asset && (
                                    <Image
                                        src={urlFor(slider.left_image.asset).toString()}
                                        alt={altFor(slider.left_image)}
                                        className="object-over object center h-full w-full"
                                        width={300}
                                        height={300}
                                    />
                                )}
                                <p>{slider.left_value}</p>
                            </div>
                            
                            <div className="absolute top-0 left-0 right-0 bottom-0 h-32">
                                {slider.right_image?.asset && (
                                    <Image
                                        src={urlFor(slider.right_image.asset).toString()}
                                        alt={altFor(slider.right_image)}
                                        className="object-over object center h-full w-full"
                                        width={300}
                                        height={300}
                                    />
                                )}
                                
                            </div>
                        </div>

                        <input 
                            type="range" 
                            min="1" 
                            max="6" 
                            className="my-4 w-full appearance-none cursor-pointer rounded-[10px] bg-gray-75 h-3 range-lg focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:bg-center"
                            onChange={handleValue}
                            />
                        
                        <div className="pt-2 flex justify-between text-gray-50">
                            <p>{slider.left_value}</p>
                            <p>{slider.right_value}</p>
                        </div>
                    </div>
                )
            )}
    
            {/* <Steps
                disabled={sliders.length == 1}
                count={sliders.length * 2}
                active={active}
                onActiveChange={setActive}
                onFinish={() => alert("done")}
            /> */}
        </div>
    )
}
