import {
	tryGetImageDimensions,
	type SanityImageDimensions,
	type SanityImageMetadata,
	type SanityImageObjectStub,
	type SanityImageSource,
} from "@sanity/asset-utils"
import createImageUrlBuilder from "@sanity/image-url"
import { env } from "@/env"

export type SanityImage = SanityImageSource &
	SanityImageObjectStub & {
		alt?: string
		asset?: { metadata?: SanityImageMetadata }
		altText?: string
	}

const builder = createImageUrlBuilder({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
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
	return field.altText ?? field.alt ?? fallback
}

/**
 * Resolve a dimensions object for a sanity image field.
 *
 * @param field
 */
export const dimensionsFor = (field: SanityImage) =>
	tryGetImageDimensions(field) as SanityImageDimensions | undefined

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
function isFilledImage(
	img: Partial<SanityImage> | undefined,
): img is SanityImage {
	return Boolean(img?.asset)
}

export const isFilled = {
	image: isFilledImage,
}
