import { Colors } from "@/colors"
import type { Brainstorm } from "@unworkshop/studio"
import { getRouteApi } from "@tanstack/react-router"
import { PresenterLoader } from "@/components/presenter-loader"
import { usePresenterBrainstorm } from "./use-presenter-brainstorm"
import { Settings } from "@/components/settings-menu"
import * as R from "remeda"
import { bucket } from "@/lib/bucket"
import { Unsorted } from "./unsorted"
import { useMultiplayerBrainstorm } from "../use-multiplayer-brainstorm"

type Props = {
	steps: Brainstorm["steps"]
}

const route = getRouteApi("/_authenticated/presenter_/$code/$exerciseSlug")

export const BrainstormPresenterComponent = (props: Props) => {
	const search = route.useSearch()
	const navigate = route.useNavigate()

	const isSorterVisible = search.brainstorm.sorter === "visible"

	const data = props.steps.at(search.step - 1)
	if (!data) throw new Error("No valid step data found.")

	const presenter = usePresenterBrainstorm()
	const participants = useMultiplayerBrainstorm()

	function toggleSorter() {
		navigate({
			search: (p) => ({
				...p,
				brainstorm: {
					...p.brainstorm,
					sorter: p.brainstorm.sorter === "visible" ? "hidden" : "visible",
				},
			}),
		})
	}

	const isLoading = presenter.connecting || participants.connecting

	const answers = R.pipe(
		participants.state.answers,
		R.values(),
		R.flatMap((answer) => answer?.[search.step]!),
		R.filter((val) => Boolean(val?.value)),
	)

	const unsorted = R.pipe(
		answers,
		R.filter(
			(a) =>
				!presenter.state.columns.some((col) => col.stickies.includes(a.id)),
		),
		(items) => bucket(items, presenter.state.buckets),
	)

	const sorted = answers.filter((a) =>
		Boolean(presenter.state.columns.some((col) => col.stickies.includes(a.id))),
	)

	return (
		<div
			className="relative py-5 px-4 flex grow flex-col"
			style={Colors.style(search.color)}
		>
			{isLoading ? (
				<PresenterLoader />
			) : (
				<div className="w-full h-full">
					{search.brainstorm.sorter === "visible" && (
						<Unsorted actions={presenter.actions} items={unsorted} />
					)}

					<div>
						{sorted.map((a) => (
							<div key={a.id}>{a.value}</div>
						))}
					</div>
				</div>
			)}

			<Settings.Root className="mt-5 self-end">
				<Settings.Toggle
					checked={!isSorterVisible}
					onCheckedChanged={toggleSorter}
				>
					{isSorterVisible ? "Hide sorter" : "Show sorter"}
				</Settings.Toggle>
			</Settings.Root>
		</div>
	)
}
