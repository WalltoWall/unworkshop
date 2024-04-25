import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { cx } from "class-variance-authority"
import type * as ST from "@/sanity/types.gen"

interface Props {
	exercise: ST.Exercise
}

export const QuadrantsHeaderNav = ({ exercise }: Props) => {
	const params = useParams()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	if (!exercise.quadrants) return null

	return (
		<ul className="mt-6 flex flex-col gap-3">
			{exercise.quadrants?.map((q, idx) => (
				<li key={q._key}>
					<Link
						href={{
							href: `/presenter/${params.code}/${exercise.slug.current}`,
							query: { step: idx + 1 },
						}}
						className={cx(
							"mx-6 block uppercase transition-opacity text-24 leading-none font-heading capsize hover:opacity-100 focus:opacity-100",
							idx + 1 === step ? "opacity-100" : "opacity-50",
						)}
					>
						Step {idx + 1}: {q.name}
					</Link>
				</li>
			))}
		</ul>
	)
}
