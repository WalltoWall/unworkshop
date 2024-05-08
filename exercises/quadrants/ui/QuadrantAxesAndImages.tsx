import { SanityImage } from "@/components/SanityImage"
import {
	isFilled,
	type MaybeSanityImage,
	type SanityImage as TSanityImage,
} from "@/sanity/helpers"

const QuadrantImage = ({ image }: { image: TSanityImage }) => {
	return (
		<SanityImage
			image={image}
			className="pointer-events-none max-h-[45px] w-full max-w-[45px] object-contain opacity-75 sm:max-h-[90px] sm:max-w-[90px]"
			aspectRatio={1}
		/>
	)
}

interface Props {
	topLeftImage?: MaybeSanityImage
	topRightImage?: MaybeSanityImage
	bottomLeftImage?: MaybeSanityImage
	bottomRightImage?: MaybeSanityImage
}

export const QuadrantAxesAndImages = (props: Props) => {
	return (
		<>
			<div className="propss-center absolute bottom-1/2 left-6 right-1/2 top-6 flex justify-center border-b-2 border-r-2 border-gray-50">
				{isFilled.image(props.topLeftImage) && (
					<QuadrantImage image={props.topLeftImage} />
				)}
			</div>

			<div className="propss-center absolute bottom-1/2 left-1/2 right-6 top-6 flex justify-center border-b-2 border-gray-50">
				{isFilled.image(props.topRightImage) && (
					<QuadrantImage image={props.topRightImage} />
				)}
			</div>

			<div className="propss-center absolute bottom-6 left-6 right-1/2 top-1/2 flex justify-center border-r-2 border-gray-50">
				{isFilled.image(props.bottomLeftImage) && (
					<QuadrantImage image={props.bottomLeftImage} />
				)}
			</div>

			<div className="propss-center absolute bottom-6 left-1/2 right-6 top-1/2 flex justify-center">
				{isFilled.image(props.bottomRightImage) && (
					<QuadrantImage image={props.bottomRightImage} />
				)}
			</div>
		</>
	)
}
