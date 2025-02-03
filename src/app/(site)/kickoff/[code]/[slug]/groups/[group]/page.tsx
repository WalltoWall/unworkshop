import React from "react"
import { notFound } from "next/navigation"
import { match } from "ts-pattern"
import { ClientOnly } from "@/components/client-only"
import { Steps } from "@/components/Steps"
import { Api } from "@/sanity/client"
import { SlidersComponent } from "@/sliders/component"
import { RequireRole } from "./require-role"
import { RoleSelector } from "./role-selector"

type Params = { code: string; slug: string; group: string }
type Props = { params: Promise<Params> }

export default async function ExerciseGroupPage(props: Props) {
	const params = await props.params
	const exercise = await Api.getExercise(params.code, params.slug)
	if (!exercise || !exercise.groups) notFound()
	if (exercise.groups.length < 2) {
		throw new Error("Invalid group configuration. Must be at least 2 groups.")
	}

	const numSteps = match(exercise)
		.with({ type: "sliders" }, (e) => e.steps.length)
		.otherwise(() => 10)

	return (
		<ClientOnly>
			<RequireRole fallback={<RoleSelector groups={exercise.groups} />}>
				<div className="grow">
					{match(exercise)
						.with({ type: "sliders" }, (e) => (
							<SlidersComponent steps={e.steps} />
						))
						.otherwise(() => null)}
				</div>

				<Steps steps={numSteps} />
			</RequireRole>
		</ClientOnly>
	)
}
