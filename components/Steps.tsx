import { Text } from "@/components/Text"
import { Checkmark } from "./icons/Checkmark"
import { Chevron } from "./icons/Chevron"

interface Props {
	count: number
	active: number
	onActiveChange: any
	onFinish: any
}

export const Steps = ({
	count,
	active = 0,
	onActiveChange,
	onFinish,
}: Props) => {
	if (!count) return null

	const handleNext = () => {
		if (active === count - 1) {
			onFinish()
		} else {
			onActiveChange(active + 1)
		}
	}

	return (
		<div className="my-6">
			<div className="relative mx-auto h-8 w-8">
				<div className="absolute right-full top-1/2 mr-2 flex -translate-y-1/2">
					{[...Array(count - (count - active))].map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-black"></div>
					))}
				</div>

				<button
					className="flex h-8 w-8 items-center justify-center rounded-full bg-black px-2 text-white"
					onClick={handleNext}
				>
					{active === count - 1 ? (
						<Checkmark />
					) : (
						<Chevron className="ml-1 rotate-180" />
					)}
				</button>

				<div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2">
					{[...Array(count - active - 1)].map((_, i) => (
						<div key={i} className="mx-1 h-3 w-3 rounded-full bg-gray-75"></div>
					))}
				</div>
			</div>

			<Text style="heading" size={16}>
				<p className="mt-3 whitespace-pre text-center font-bold uppercase">
					{active === count - 1 ? "Finish" : "Next Step"}
				</p>
			</Text>
		</div>
	)
}
