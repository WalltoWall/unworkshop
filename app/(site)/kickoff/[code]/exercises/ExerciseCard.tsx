import Image from "next/image"
import Link from "next/link"
import { cx } from "class-variance-authority"
import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import { CardVariantSequence } from "./card-variants"

interface Props {
	kickoffCode: string | undefined
	slug: string | undefined
	name: string
	type: ST.Exercise["type"]
	groups?: boolean
	groupSlug?: string
	presenter?: boolean
}

const sequence = new CardVariantSequence([
	"form",
	"sliders",
	"quadrants",
	"brainstorm",
])

export const ExerciseCard = (props: Props) => {
	const variant = sequence.nextVariant()

	let href = `/kickoff/${props.kickoffCode}/exercises/${props.slug}`

	if (props.presenter) {
		href = `/presenter/${props.kickoffCode}/${props.slug}`
	} else if (props.groups) {
		href = `/kickoff/${props.kickoffCode}/exercises/${props.slug}/groups${props.groupSlug ? `/${props.groupSlug}` : ""}`
	}

	return (
		<Link
			href={href}
			className={cx(
				"relative grid aspect-[289/160] grid-cols-[4fr,6fr] overflow-hidden rounded-lg bg-gradient-to-r",
				variant.gradientClassName,
			)}
			suppressHydrationWarning
		>
			<div className="self-end pb-4 pl-3">
				<Text style="heading" size={24}>
					{props.name}
				</Text>

				<div className="mt-2 flex items-center gap-1">
					<Text style="copy" size={16}>
						Start Exercise
					</Text>

					<Arrow className="w-3 rotate-180" />
				</div>
			</div>

			<Image
				src={variant.imageSrc}
				alt=""
				placeholder="blur"
				suppressHydrationWarning
				className={cx(
					"absolute right-0 top-0 object-contain",
					variant.imageClassName,
				)}
			/>
		</Link>
	)
}
