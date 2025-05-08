import { PlusIcon } from "lucide-react"

type Props = {
	addColumn: () => void
}
export const AddUnsortedColumnButton = (props: Props) => {
	return (
		<button
			className="size-36 rounded-lg bg-neutral-200 mt-auto flex flex-col justify-center items-center gap-1.5 hover:bg-neutral-300 shadow-inner duration-300 ease group/add shrink-0"
			onClick={props.addColumn}
		>
			<div className="size-8 rounded-full bg-neutral-500 text-neutral-200 flex items-center justify-center group-hover/add:bg-neutral-600 mt-4 duration-300 ease">
				<PlusIcon className="size-5" strokeWidth={2} />
			</div>
			<p className="font-sans text-neutral-500 text-sm font-bold group-hover/add:text-neutral-700 duration-300 ease">
				Add Column
			</p>
		</button>
	)
}
