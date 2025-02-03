import React from "react"
import { notFound } from "next/navigation"
import { match } from "ts-pattern"
import { ClientOnly } from "@/components/client-only"
import { Steps } from "@/components/Steps"
import { Api } from "@/sanity/client"
import { SlidersComponent } from "@/sliders/component"
import { text } from "@/styles/text"

type Params = { code: string; slug: string }
type Props = { params: Promise<Params> }

export default async function ExercisePage(props: Props) {
	const params = await props.params
	const exercise = await Api.getExercise(params.code, params.slug)
	if (!exercise) notFound()

	const numSteps = match(exercise)
		.with({ type: "sliders" }, (e) => e.steps.length)
		.otherwise(() => 10)

	return (
		<div className="flex grow flex-col gap-5">
			<h1 className={text({ size: 40, style: "heading" })}>{exercise.name}</h1>

			<React.Suspense>
				<div className="grow">
					<ClientOnly>
						{match(exercise)
							.with({ type: "sliders" }, (e) => (
								<SlidersComponent steps={e.steps} />
							))
							.otherwise(() => null)}
					</ClientOnly>
				</div>

				<Steps steps={numSteps} />
			</React.Suspense>
		</div>
	)
}
