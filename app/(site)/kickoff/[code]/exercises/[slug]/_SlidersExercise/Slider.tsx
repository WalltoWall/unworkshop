"use client"

import { useState } from "react"
import Image from "next/image"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import { cx } from "class-variance-authority"
import { type SliderItem } from "./SlidersExercise"
import { submitSliderAction } from "./actions"
import React from "react"
import { useDebounce } from "../_BrainstormExercise/debounce"
import type { Answer } from "./types"
import { Text } from "@/components/Text"
import { unset } from "sanity"

type Props = {
	exerciseId: string
	item: SliderItem
	group?: boolean
    answer: Answer
}

export const Slider = ({ item, exerciseId, group, answer }: Props) => {
	const [values, setValues] = useState({
        todayValue: answer?.today || 3,
        tomorrowValue: answer?.tomorrow || 3
    })

    const formRef = React.useRef<HTMLFormElement>(null)
    const submitForm = useDebounce(() => formRef.current?.requestSubmit(), 250)

	return (
        <div className="mt-8" key={item._key}>
            <h3>{item.question_text}</h3>

            <form
            action={submitSliderAction}
            ref={formRef}
            > 
                {/* TODAY */}
                <div className="rounded-lg bg-gray-97 p-4 mt-2">
                    <input type="hidden" value={item.slug.current} name="slug" />
                    <input type="hidden" value={exerciseId} name="exerciseId" />
                    <input
                        type="checkbox"
                        defaultChecked={group}
                        name="isGroup"
                        className="hidden"
                    />
                    <Text>Where are we today?</Text>
                    <div className="relative my-3 h-32 overflow-hidden rounded-lg flex justify-between">
                        {isFilled.image(item.left_image) ?
                            <div className="w-1/2 h-32 bg-black">
                                <Image
                                    src={urlFor(item.left_image).url()!}
                                    alt={altFor(item.left_image)}
                                    className="object-cover object-center opacity-100 h-full w-full transition-opacity transition-[filter]"
                                    width={300}
                                    height={300}
                                    style={{
                                        opacity: 1.1 - (values.todayValue / 10),
                                        filter: values.todayValue == 1 ? `grayscale(0)` : `grayScale(${(values.todayValue / 6) * 100 + "%"})`
                                    }}
                                />
                            </div>
                            : 
                            <div className="h-full flex px-2 justify-center items-center bg-pink-85 transition-[width]"
                            style={{
                                width: 100 - ((values.todayValue / 7) * 100) + "%"
                            }}
                            >
                                <p className="uppercase font-heading capsize transition-[font-size] transition-[transform]"
                                style={{
                                    transform: values.todayValue == 6 ? "rotate(-90deg)":"rotate(0deg)", 
                                }}
                                >
                                    <svg className="w-full" viewBox="0 0 75 18">
                                        <text x="0" y="15">{item.left_value}</text>
                                    </svg>
                                </p>
                            </div>
                        }

                        {isFilled.image(item.right_image) ?
                            <div className="w-1/2 h-32 bg-black">
                                <Image
                                    src={urlFor(item.right_image).url()!}
                                    alt={altFor(item.right_image)}
                                    className="object-cover object-center opacity-100 h-full w-full transition-opacity transition-[filter]"
                                    width={300}
                                    height={300}
                                    style={{
                                        opacity: 0.4 + (values.todayValue / 10),
                                        filter: values.todayValue == 1 ? `grayscale(1)` : `grayScale(${100 - ((values.todayValue / 6) * 100) + "%"})`
                                    }}
                                />
                            </div>
                            : <div className="h-full flex px-2 justify-center items-center bg-green-78 transition-[width]"
                             style={{
                                 width: (values.todayValue / 7) * 100 + "%"
                             }}
                             >
                                 <p className="uppercase font-heading capsize transition-[font-size] transition-[transform] w-full"
                                 style={{
                                    transform: values.todayValue == 1 ? "rotate(90deg)":"rotate(0deg)", 
                                 }}
                                 >
                                    <svg className="w-full" viewBox="0 0 75 18">
                                        <text x="0" y="15">{item.right_value}</text>
                                    </svg>
                                </p>
                             </div>
                        }
                    </div>
                    <input
                        type="range"
                        name="todayValue"
                        min={1}
                        max={6}
                        value={values.todayValue}
                        className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
                        onChange={(e) => {
                            setValues({
                                ...values,
                                todayValue: parseInt(e.target.value)
                            })
                            submitForm()
                        }}
                    />
                    <div className="flex justify-between pt-2 text-gray-50">
                        <Text>{item.left_value}</Text>
                        <Text>{item.right_value}</Text>
                    </div>
                </div>

                  
                {/* TOMORROW */}
                <div className="rounded-lg bg-gray-97 p-4 mt-8">
                    <Text>Where are we tomorrow?</Text>
                    <div className="relative my-3 h-32 overflow-hidden rounded-lg justify-between"
                    style={{
                        display: isFilled.image(item.left_image) || isFilled.image(item.right_image) ? "block": "flex",
                    }}
                    >
                        {isFilled.image(item.left_image) ?
                            <div className="absolute bottom-0 left-0 right-50 top-0 h-32">
                                <Image
                                    src={urlFor(item.left_image).url()!}
                                    alt={altFor(item.left_image)}
                                    className="object-cover object-center opacity-100 h-full w-full"
                                    width={300}
                                    height={300}
                                />
                            </div>
                            : 
                            <div className="h-full flex px-2 justify-center items-center bg-pink-85 transition-[width]"
                            style={{
                                width: 100 - ((values.tomorrowValue / 7) * 100) + "%"
                            }}
                            >
                                <p className="uppercase font-heading capsize transition-[font-size] transition-[transform]"
                                style={{
                                    transform: values.tomorrowValue == 6 ? "rotate(-90deg)":"rotate(0deg)", 
                                }}
                                >
                                    <svg className="w-full" viewBox="0 0 75 18">
                                        <text x="0" y="15">{item.left_value}</text>
                                    </svg>
                                </p>
                            </div>
                        }

                        {isFilled.image(item.right_image) ?
                            <div className="absolute bottom-0 left-50 right-0 top-0 h-32">
                                <Image
                                    src={urlFor(item.right_image).url()!}
                                    alt={altFor(item.right_image)}
                                    className={cx("object-cover object-center h-full w-full transition ease-in-out",
                                        values.tomorrowValue >= 3.5 ? "opacity-100" : "opacity-0"
                                    )}
                                    width={300}
                                    height={300}
                                />
                            </div>
                            : <div className="h-full flex px-2 justify-center items-center bg-green-78 transition-[width]"
                             style={{
                                 width: (values.tomorrowValue / 7) * 100 + "%"
                             }}
                             >
                                 <p className="uppercase font-heading capsize transition-[font-size] transition-[transform] w-full"
                                 style={{
                                    transform: values.tomorrowValue == 1 ? "rotate(90deg)":"rotate(0deg)", 
                                 }}
                                 >
                                    <svg className="w-full" viewBox="0 0 75 18">
                                        <text x="0" y="15">{item.right_value}</text>
                                    </svg>
                                </p>
                             </div>
                        }
                    </div>
                    
                    <input
                        type="range"
                        name="tomorrowValue"
                        min={1}
                        max={6}
                        value={values.tomorrowValue}
                        className="range-lg my-4 h-3 w-full cursor-pointer appearance-none rounded-[10px] bg-gray-75 focus-within:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:w-[32px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat"
                        onChange={(e) => {
                            setValues({
                                ...values,
                                tomorrowValue: parseInt(e.target.value)
                            })
                            submitForm()
                        }}
                    />
                    <div className="flex justify-between pt-2 text-gray-50">
                        <Text>{item.left_value}</Text>
                        <Text>{item.right_value}</Text>
                    </div>
                </div>
            </form>
        </div>
	)
}