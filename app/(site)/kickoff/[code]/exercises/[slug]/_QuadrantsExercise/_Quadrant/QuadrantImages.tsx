import Image from "next/image"
import { altFor, isFilled, urlFor, type SanityImage } from "@/sanity/helpers"
import type * as ST from "@/sanity/types.gen"

const QuadrantImage = ({ image }: { image: SanityImage }) => {
	const url = urlFor(image).width(150).height(150).format("webp").toString()
	if (!url) return null

	return (
		<Image
			src={url}
			alt={altFor(image)}
			className="pointer-events-none max-h-[45px] w-full max-w-[45px] object-contain opacity-75 sm:max-h-[90px] sm:max-w-[90px]"
			width={150}
			height={150}
		/>
	)
}

type QuadrantImagesProps = {
	item: NonNullable<ST.Exercise["quadrants"]>[number]
}

export const QuadrantImages = ({ item }: QuadrantImagesProps) => {
	return (
		<>
			<div className="absolute left-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-r-2 border-gray-50">
				{isFilled.image(item.topLeftImage) && (
					<QuadrantImage image={item.topLeftImage} />
				)}
			</div>
			<div className="absolute right-0 top-0 flex h-1/2 w-1/2 items-center justify-center border-b-2 border-gray-50">
				{isFilled.image(item.topRightImage) && (
					<QuadrantImage image={item.topRightImage} />
				)}
			</div>
			<div className="absolute bottom-0 left-0 flex h-1/2 w-1/2 items-center justify-center border-r-2 border-gray-50">
				{isFilled.image(item.bottomLeftImage) && (
					<QuadrantImage image={item.bottomLeftImage} />
				)}
			</div>
			<div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 items-center justify-center">
				{isFilled.image(item.bottomRightImage) && (
					<QuadrantImage image={item.bottomRightImage} />
				)}
			</div>
		</>
	)
}
