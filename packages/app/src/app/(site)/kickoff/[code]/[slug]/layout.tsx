import React from "react"
import { notFound } from "next/navigation"
import { Api } from "@/sanity/client"
import { text } from "@/styles/text"
import { RequireRole } from "./groups/[group]/require-role"
import { RoleHeader } from "./role-header"

type Params = { code: string; slug: string }
type Props = { params: Promise<Params>; children: React.ReactNode }

export default async function ExerciseLayout(props: Props) {
	const params = await props.params
	const exercise = await Api.getExercise(params.code, params.slug)
	if (!exercise) notFound()

	return (
		<div className="flex grow flex-col">
			<RequireRole>
				<RoleHeader groups={exercise.groups ?? []} className="mb-5" />
			</RequireRole>

			<h1 className={text({ size: 40, style: "heading" })}>{exercise.name}</h1>

			<React.Suspense>{props.children}</React.Suspense>
		</div>
	)
}
