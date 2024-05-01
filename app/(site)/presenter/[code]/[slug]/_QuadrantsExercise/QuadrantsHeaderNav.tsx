import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { cx } from "class-variance-authority"
import * as R from "remeda"

interface Props {
	steps: number
	slug: string
}

export const ExerciseWithStepsNav = ({ steps, slug }: Props) => {
	const params = useParams()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	return (
		<ul className="mt-6 flex flex-col gap-3">
			{R.range(0, steps).map((idx) => (
				<li key={idx}>
					<Link
						href={{
							href: `/presenter/${params.code}/${slug}`,
							query: { step: idx + 1 },
						}}
						className={cx(
							"mx-6 block uppercase transition-opacity text-24 leading-none font-heading capsize hover:opacity-100 focus:opacity-100",
							idx + 1 === step ? "opacity-100" : "opacity-50",
						)}
					>
						Step {idx + 1}
					</Link>
				</li>
			))}
		</ul>
	)
}
