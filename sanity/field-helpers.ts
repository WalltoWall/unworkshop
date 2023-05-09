import createImageUrlBuilder from "@sanity/image-url"
import { env } from "@/env"
import {
	type SanityImageDimensions,
	tryGetImageDimensions,
} from "@sanity/asset-utils"

const builder = createImageUrlBuilder({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
})

export const urlFor = (img: ST.Image) => {
	return builder.image(img).width(2500)
}

export function altFor(img: ST.Image) {
	return img.altText ?? img.alt ?? ""
}

export const dimensionsFor = (img: ST.Image) =>
	tryGetImageDimensions(img) as SanityImageDimensions | undefined
