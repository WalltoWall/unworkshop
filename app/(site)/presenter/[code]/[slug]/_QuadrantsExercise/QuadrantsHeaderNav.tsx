import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { ST } from "@/sanity/types.gen"
import { StepNavItem } from "../../../PresenterHeader"

interface Props {
	exercise: ST["exercise"]
}

export const QuadrantsHeaderNav = ({ exercise }: Props) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	const handleClick = (nextStep: number) => {
		const params = new URLSearchParams({
			step: nextStep.toString(),
		})

		router.push(pathname + "?" + params.toString(), { scroll: false })
	}

	return exercise.quadrants!.length > 0 ? (
		<ul className="mt-6 flex flex-col gap-3">
			{exercise.quadrants?.map((quadrant, index) => (
				<li key={quadrant._key}>
					<StepNavItem
						onClick={() => handleClick(index + 1)}
						active={index + 1 === step}
					>
						Step {index + 1}: {quadrant.name}
					</StepNavItem>
				</li>
			))}
		</ul>
	) : null
}
