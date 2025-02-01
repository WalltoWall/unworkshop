import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"
import { type CardGradientData } from "./card-gradients"
import { type CardIllustrationData } from "./card-illustrations"

interface Props {
	name: string
	gradient: CardGradientData
	illustration: CardIllustrationData
	href: string
}

export const ExerciseCard = (props: Props) => {
	return (
		<Link
			href={props.href}
			className={cx(
				"relative grid aspect-[289/160] grid-cols-[4fr,6fr] overflow-hidden rounded-lg bg-gradient-to-r",
				props.gradient,
			)}
			suppressHydrationWarning
		>
			<div className="self-end pb-4 pl-3">
				<Text style="heading" size={24}>
					{props.name}
				</Text>

				<div className="mt-1 flex items-end gap-1">
					<Text style="copy" size={16}>
						Start Exercise
					</Text>

					<ArrowRightIcon className="size-3.5" />
				</div>
			</div>

			<Image
				src={props.illustration.src}
				alt=""
				suppressHydrationWarning
				className={cx(
					"absolute top-0 right-0 object-contain",
					props.illustration.className,
				)}
			/>
		</Link>
	)
}
