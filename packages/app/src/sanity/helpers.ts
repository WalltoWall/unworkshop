import {
	tryGetImageDimensions,
	type SanityImageDimensions,
	type SanityImageSource,
} from "@sanity/asset-utils"
import createImageUrlBuilder from "@sanity/image-url"
import type * as ST from "@unworkshop/studio"

export type MaybeSanityImage = Record<string, unknown> | undefined | null
export type SanityImage = Omit<SanityImageSource, string> & {
	alt?: string
	asset: ST.SanityImageAsset
	crop?: Required<ST.SanityImageCrop>
	altText?: string
}

const builder = createImageUrlBuilder({
	projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
	dataset: import.meta.env.VITE_SANITY_DATASET,
})

/**
 * Get a URL for a Sanity image field.
 *
 * @param field
 * @returns The URL builder instance
 *
 * @example
 * Basic usage:
 * ```
 * urlFor(image).toString()
 * ```
 *
 * @example
 * Builder Pattern
 * ```
 * urlFor(image)
 *  .width(1280)
 *  .height(720)
 *  .format('auto')
 *  .toString()
 * ```
 */
export const urlFor = (field: SanityImage) => {
	return builder.image(field).width(2500)
}

/**
 * Resolve the alt text for a Sanity image field.
 *
 * @param field
 * @param fallback - The fallback alt text to use if not provided in Sanity. Defaults to empty string to denote the image as decorative.
 * @returns The alt text string.
 *
 * @example
 * Basic usage:
 * ```
 * altFor(image)
 * ```
 *
 * @example
 * Custom fallback:
 * ```
 * altFor(image, "Lorem Ipsum")
 * ```
 *
 */
export function altFor(field: SanityImage, fallback = "") {
	return (field.altText ?? field.alt ?? fallback).trim()
}

/**
 * Resolve a dimensions object for a sanity image field.
 *
 * @param field
 */
export const dimensionsFor = (field: SanityImage) => {
	const dimensions = tryGetImageDimensions(field) as SanityImageDimensions
	if (!field.crop || !dimensions)
		return {
			width: Math.round(dimensions.width),
			height: Math.round(dimensions.height),
			aspectRatio: dimensions.aspectRatio,
		}

	const width = Math.round(
		dimensions.width * (1 - field.crop.left - field.crop.right),
	)
	const height = Math.round(
		dimensions.height * (1 - field.crop.top - field.crop.bottom),
	)
	const aspectRatio = width / height

	return {
		width,
		height,
		aspectRatio,
	}
}

/**
 * Resolve the provided slug string, taking into account any project-specific
 * routing logic.
 *
 * @param slug
 */
export function slugResolver(slug: string | undefined) {
	if (!slug || slug === "/home/") return "/"

	return slug
}

/**
 * Verifies and asserts that the provided image field has been properly filled
 * in the CMS.
 *
 * @param img
 */
function isFilledImage(img: MaybeSanityImage): img is SanityImage {
	if (!img) return false

	return Boolean(img?.asset)
}

export const isFilled = {
	image: isFilledImage,
}
