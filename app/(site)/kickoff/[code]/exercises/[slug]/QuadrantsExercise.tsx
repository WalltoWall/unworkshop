"use client"

import { Text } from "@/components/Text"
import { RichText } from "@/components/RichText"
import Image from "next/image"
import { urlFor, altFor } from "@/sanity/field-helpers"
import { useEffect, useRef, useState } from "react"
import { Steps } from "@/components/Steps"

interface QuadrantItem {
	id: number
	label: string
	key: any
	bottomLeftImage?: any
	bottomRightImage?: any
	bottomValue: string
	leftValue: string
	rightValue: string
	time: "today" | "tomorrow"
	topLeftImage?: any
	topRightImage?: any
	topValue: string
	topic: string
	_key: string
}

type Props = {
	quadrants: Array<QuadrantItem>
}

const serializers = {
	strong: (props) => (
		<strong className="text-indigo-68">{props.children}</strong>
	),
}

const Quadrant = ({ item }: QuadrantItem) => {
	const clickTarget = useRef(null)
	const clickMarker = useRef(null)

	useEffect(() => {
		if (clickTarget.current) {
			clickTarget.current?.addEventListener("click", handleClick)
		}

		return () => {
			clickTarget?.current?.removeEventListener("click", handleClick)
		}
	}, [clickTarget])

	const handleClick = (event) => {
		if (clickMarker?.current) {
			const parentRect = clickTarget.current.getBoundingClientRect()

			clickMarker.current.style.opacity = 1
			clickMarker.current.style.top = `${event.clientY - parentRect.top}px`
			clickMarker.current.style.left = `${event.clientX - parentRect.left}px`
		}
	}

	return (
		<>
			<div className="mx-auto flex max-w-[255px] content-center items-center rounded-2xl bg-gray-97 px-7 pb-6 pt-7">
				{item.time === "today" && (
					<div className="mr-2 h-8 w-8 flex-none rounded-full border-4 border-indigo-68" />
				)}
				<Text style="heading" size={18} asChild>
					<h2 className="mt-1">
						<RichText
							content={item.instructions}
							components={{ ...serializers }}
						/>
					</h2>
				</Text>
			</div>

			<div className="relative p-12">
				<h3 className="absolute left-0 top-5 w-full text-center text-gray-50">
					{item.topValue}
				</h3>
				<h3 className="absolute bottom-5 left-0 w-full text-center text-gray-50">
					{item.bottomValue}
				</h3>
				<h3 className="absolute bottom-0 left-11 w-full origin-bottom-left -rotate-90 text-center text-gray-50">
					{item.leftValue}
				</h3>
				<h3 className="absolute bottom-0 right-11 w-full origin-bottom-right rotate-90 text-center text-gray-50">
					{item.rightValue}
				</h3>
				<div
					ref={clickTarget}
					className="relative before:block before:pt-[100%]"
				>
					<div className="absolute left-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-r-2 border-gray-50">
						{item.topLeftImage?.asset && (
							<Image
								src={urlFor(item.topLeftImage.asset).toString()}
								alt={altFor(item.topLeftImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>
					<div className="absolute right-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-gray-50">
						{item.topRightImage?.asset && (
							<Image
								src={urlFor(item.topRightImage.asset).toString()}
								alt={altFor(item.topRightImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>
					<div className="absolute bottom-0 left-0 flex h-1/2 w-1/2 items-center justify-center border-r-2 border-gray-50">
						{item.bottomLeftImage?.asset && (
							<Image
								src={urlFor(item.bottomLeftImage.asset).toString()}
								alt={altFor(item.bottomLeftImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>
					<div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 items-center justify-center">
						{item.bottomRightImage?.asset && (
							<Image
								src={urlFor(item.bottomRightImage.asset).toString()}
								alt={altFor(item.bottomRightImage)}
								className="max-h-[90px] w-full max-w-[90px] object-contain"
								width={150}
								height={150}
							/>
						)}
					</div>

					<div
						ref={clickMarker}
						className="pointer-events-none absolute left-0 top-0 -ml-4 -mt-4 h-8 w-8 rounded-full border-4 border-indigo-68 opacity-0 transition-opacity"
					/>
				</div>
			</div>
		</>
	)
}

export const QuadrantsExercise = ({ quadrants }: Props) => {
	const [active, setActive] = useState(0)
	if (!quadrants) return null

	return (
		<div className="mt-8">
			{quadrants.map((quadrant, index) => (
				<div key={quadrant._key}>
					{index === active && <Quadrant item={quadrant} />}
				</div>
			))}

			<Steps
				count={quadrants.length}
				active={active}
				onActiveChange={setActive}
				onFinish={() => alert("done")}
			/>
		</div>
	)
}
