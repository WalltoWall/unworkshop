"use client"

import * as React from "react"
import Image, { getImageProps, type ImageProps } from "next/image"
import {
	altFor,
	dimensionsFor,
	urlFor,
	type SanityImage as _SanityImage,
} from "@/sanity/helpers"

type SanityImageProps = Omit<
	ImageProps,
	"src" | "loader" | "alt" | "blurDataURL" | "fill" | "width" | "height"
> & {
	/** The image field from Sanity. */
	image: _SanityImage

	/** If provided, will crop the image to this aspect ratio. Respects the crop
	 * and hotspot preferences from Sanity. */
	aspectRatio?: number
}

type GetSanityImagePropsArgs = {
	image: _SanityImage
	aspectRatio: number
	quality?: number
}

/**
 * For more advanced use cases, you can call getSanityImageProps() to get the
 * props that would be passed to an underlying <img> element, and instead pass
 * to them to another component, such as when working with <picture> tags.
 *
 * @see https://nextjs.org/docs/pages/api-reference/components/image#getimageprops
 *
 * @param args
 */
export function getSanityImageProps(args: GetSanityImagePropsArgs) {
	const dimensions = dimensionsFor(args.image)
	if (!dimensions) {
		if (process.env.NODE_ENV === "development")
			console.warn(
				"Img failed to produce dimensions. Returning null.",
				args.image,
			)

		return null
	}

	const height = Math.round(dimensions.width / args.aspectRatio)
	const src = urlFor(args.image)
		.width(dimensions.width)
		.height(height)
		.quality(100) // Quality is 100 since NextJS will apply its own quality.
		.auto("format")
		.url()!

	return getImageProps({
		src,
		alt: altFor(args.image),
		width: dimensions.width,
		height,
		quality: args.quality ?? 75,
	})
}

export const SanityImage = React.forwardRef<HTMLImageElement, SanityImageProps>(
	(
		{ image, placeholder, sizes: _sizes, aspectRatio: _aspectRatio, ...props },
		ref,
	) => {
		if (placeholder === "blur" && !image.asset.metadata?.lqip) {
			throw new Error(
				"SanityImage component set placeholder to 'blur' but did not provide a 'blurDataURL'. Be sure to use the 'imageBlurFragment' in the query for this image.",
			)
		}

		const dimensions = dimensionsFor(image)
		if (!dimensions) {
			if (process.env.NODE_ENV === "development")
				console.warn(
					"Image failed to produce dimensions. Returning null.",
					image,
				)

			return null
		}

		const aspectRatio = _aspectRatio ?? dimensions.aspectRatio
		const height = Math.round(dimensions.width / aspectRatio)

		const src = urlFor(image)
			.width(dimensions.width)
			.height(height)
			.quality(100) // Quality is 100 since NextJS will apply its own quality.
			.auto("format")
			.url()!

		const sizes =
			_sizes ??
			`(min-width: ${dimensions.width}px) ${dimensions.width}px, 100vw`

		return (
			<Image
				ref={ref}
				width={dimensions.width}
				height={height}
				src={src}
				alt={altFor(image)}
				placeholder={placeholder}
				sizes={sizes}
				blurDataURL={image.asset.metadata?.lqip}
				{...props}
			/>
		)
	},
)
SanityImage.displayName = "SanityImage"
