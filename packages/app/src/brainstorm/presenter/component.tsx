import { getRouteApi } from "@tanstack/react-router"
import type { Brainstorm } from "@unworkshop/studio"
import * as R from "remeda"
import { Colors } from "@/colors"
import { PresenterLoader } from "@/components/presenter-loader"
import { Settings } from "@/components/settings-menu"
import { bucket } from "@/lib/bucket"
import { useMultiplayerBrainstorm } from "../use-multiplayer-brainstorm"
import { Unsorted } from "./unsorted"
import { usePresenterBrainstorm } from "./use-presenter-brainstorm"
import { DEFAULT_BUCKETS } from "./constants"
import { SortedColumns } from "./sorted-columns"
import type { BrainstormPresenterS } from "./schemas"
import type { BrainstormS } from "../schemas"

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
		participants.state.groupAnswers,
		R.values(),
		R.flatMap((answer) => answer?.[search.step]!),
		R.filter((val) => Boolean(val?.value)),
	)

	const unsorted: BrainstormS.Sticky[] = []
	const sorted: BrainstormS.Sticky[] = []

	answers.forEach((a) => {
		const isSorted = presenter.state.columns.some((col) =>
			col.stickies.includes(a.id),
		)
		if (isSorted) {
			sorted.push(a)
		} else {
			unsorted.push(a)
		}
	})

	const unsortedBuckets = bucket(
		unsorted,
		presenter.state.meta.buckets ?? DEFAULT_BUCKETS,
	)

	return (
		<div
			className="relative py-5 px-4 flex grow flex-col"
			style={Colors.style(search.color)}
		>
			{isLoading ? (
				<PresenterLoader />
			) : (
				<div className="w-full h-full flex flex-col gap-8">
					{search.brainstorm.sorter === "visible" && (
						<Unsorted
							actions={presenter.actions}
							buckets={unsortedBuckets}
							columns={presenter.state.columns}
						/>
					)}

					<SortedColumns
						actions={presenter.actions}
						columns={presenter.state.columns}
						sorted={sorted}
					/>
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
