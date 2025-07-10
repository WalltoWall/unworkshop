import { Colors } from "@/colors"
import { Settings } from "@/components/settings-menu"
import type { Sliders } from "@unworkshop/studio"
import { BarsView } from "./bars-view"
import { DotsView } from "./dots-view"
import { Key } from "./key"
import { PresenterSteps } from "./steps"
import { getRouteApi } from "@tanstack/react-router"
import { slugifyPortableText } from "@/lib/slugify-portable-text"
import { usePresenterSliders } from "./use-presenter-sliders"
import * as R from "remeda"
import { PresenterLoader } from "@/components/presenter-loader"

type Props = {
	steps: Sliders["steps"]
}

const route = getRouteApi("/_authenticated/presenter_/$code/$exerciseSlug")

export const SlidersPresenterComponent = (props: Props) => {
	const search = route.useSearch()
	const navigate = route.useNavigate()

	const isDots = search.sliders.view === "dots"

	const data = props.steps.at(search.step - 1)
	if (!data) throw new Error("No valid step data found.")

	const prompt = slugifyPortableText(data.prompt)

	const left = data.sliders.at(0)?.left ?? data.sliders.at(1)?.left
	const right = data.sliders.at(0)?.right ?? data.sliders.at(1)?.right
	if (!left) throw new Error("No valid 'left' slider value found.")
	if (!right) throw new Error("No valid 'right' slider value found.")

	const presenter = usePresenterSliders()

	const answers = R.pipe(
		presenter.answers,
		R.values(),
		R.map((answers) => answers?.[prompt]!),
		R.filter((v) => Boolean(v)),
	)

	const toggleView = () => {
		navigate({
			search: (p) => ({
				...p,
				sliders: {
					...p.sliders,
					view: p.sliders.view === "bars" ? "dots" : "bars",
				},
			}),
		})
	}

	return (
		<div
			className="relative m-5 flex grow flex-col"
			style={Colors.style(search.color)}
		>
			<Key view={search.sliders.view} />

			{presenter.connecting ? (
				<PresenterLoader />
			) : isDots ? (
				<DotsView answers={answers} />
			) : (
				<BarsView answers={answers} />
			)}

			<PresenterSteps
				left={left}
				right={right}
				numSteps={props.steps.length}
				className="mt-4"
			/>

			<Settings.Root className="mt-5 self-end">
				<Settings.Toggle checked={isDots} onCheckedChanged={toggleView}>
					{isDots ? "Show Bars view" : "Show Dots View"}
				</Settings.Toggle>
				<Settings.ColorPicker />
			</Settings.Root>
		</div>
	)
}
