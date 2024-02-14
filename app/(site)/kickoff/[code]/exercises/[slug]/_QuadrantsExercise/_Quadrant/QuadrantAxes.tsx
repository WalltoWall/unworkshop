import type { ST } from "@/sanity/types.gen"

type QuadrantAxesProps = {
	item: NonNullable<ST["exercise"]["quadrants"]>[number]
}

export const QuadrantAxes = ({ item }: QuadrantAxesProps) => (
	<>
		<h3 className="absolute left-0 top-2 w-full text-center text-gray-50 md:top-5">
			{item.topValue}
		</h3>
		<h3 className="absolute bottom-1 left-0 w-full text-center text-gray-50 md:bottom-5">
			{item.bottomValue}
		</h3>
		<h3 className="absolute bottom-0 left-7 w-full origin-bottom-left -rotate-90 text-center text-gray-50 md:left-11">
			{item.leftValue}
		</h3>
		<h3 className="absolute bottom-0 right-7 w-full origin-bottom-right rotate-90 text-center text-gray-50 md:right-11">
			{item.rightValue}
		</h3>
	</>
)
