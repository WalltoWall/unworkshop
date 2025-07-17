import { ArrowRightIcon } from "@heroicons/react/16/solid"
import { createLink, type LinkComponent } from "@tanstack/react-router"
import { cx } from "class-variance-authority"
import type { CardGradientData } from "@/lib/card-gradients"
import type { CardIllustrationData } from "@/lib/card-illustrations"
import { text } from "@/styles/text"

interface Props extends React.ComponentProps<"a"> {
	name: string
	gradient: CardGradientData
	illustration: CardIllustrationData
	label?: string
}

const _ExerciseCard = ({ children, ...props }: Props) => {
	return (
		<a
			className={cx(
				"group/card relative grid aspect-[289/160] grid-cols-[4fr,6fr] overflow-hidden rounded-lg bg-gradient-to-r transition hover:brightness-105",
				props.gradient,
			)}
			{...props}
		>
			<div className="self-end pb-4 pl-3">
				<h2 className={text({ style: "heading", size: 24 })}>{props.name}</h2>

				<div className="mt-1 flex items-end gap-1">
					<p className={text({ style: "copy", size: 16 })}>
						{props.label ?? "Start Exercise"}
					</p>

					<ArrowRightIcon className="mb-px size-3.5 transition ease-out group-hover/card:translate-x-1" />
				</div>
			</div>

			<img
				src={props.illustration.src}
				alt=""
				className={cx(
					"absolute top-0 right-0 object-contain",
					props.illustration.className,
				)}
			/>
		</a>
	)
}

const CreatedExerciseCard = createLink(_ExerciseCard)

export const ExerciseCard: LinkComponent<typeof _ExerciseCard> = (props) => {
	return <CreatedExerciseCard {...props} />
}
