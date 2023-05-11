import Link from "next/link"
import Image from "next/image"
import { Text } from "@/components/Text"
import { Arrow } from "@/components/icons/Arrow"
import type { Exercise } from "@/sanity/schemas/documents/Exercise"
import { cx } from "class-variance-authority"

import brainstormIllustration from "@/assets/images/brainstorm-illustration.jpg"
import slidersIllustration from "@/assets/images/sliders-illustration.jpg"
import formIllustration from "@/assets/images/form-illustration.png"

const variants = {
	brainstorm: {
		gradientClassName: "from-[#4BEEE1] to-[#E477D1]",
		imageSrc: brainstormIllustration,
		imageClassName:
			"-translate-y-[3%] translate-x-[28%] -rotate-[17deg] mix-blend-multiply h-[128%]",
	},
	sliders: {
		gradientClassName: "from-[#E561D0] to-[#EA892C]",
		imageSrc: slidersIllustration,
		imageClassName:
			"mix-blend-multiply h-[175%] translate-x-[27%] -translate-y-[3%]",
	},
	quadrants: {
		gradientClassName: "from-[#4BEEE1] to-[#90E477]",
		imageSrc: brainstormIllustration,
		imageClassName: "",
	},
	form: {
		gradientClassName: "from-[#FA927F] to-[#D7F082]",
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
}

// TODO: Exercise status, e.g. "Start Exercise", "Completed" etc.
type Props = {
	kickoffCode: string | undefined
	slug: string | undefined
	name: string
	type: Exercise["type"]
}

export const ExerciseCard = (props: Props) => {
	const variant = variants[props.type]

	return (
		<Link
			href={`/kickoff/${props.kickoffCode}/exercises/${props.slug}`}
			className={cx(
				"relative grid aspect-[289/160] grid-cols-[4fr,6fr] overflow-hidden rounded-lg bg-gradient-to-r",
				variant.gradientClassName,
			)}
		>
			<div className="self-end pb-4 pl-3">
				<Text style="heading" size={24}>
					{props.name}
				</Text>

				<div className="mt-1 flex items-center gap-1">
					<Text style="copy" size={16}>
						Start Exercise
					</Text>

					<Arrow className="w-3" />
				</div>
			</div>

			<Image
				src={variant.imageSrc}
				alt=""
				placeholder="blur"
				className={cx(
					"absolute right-0 top-0 object-contain",
					variant.imageClassName,
				)}
			/>
		</Link>
	)
}
