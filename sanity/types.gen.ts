/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
	_type: "sanity.imagePaletteSwatch"
	background?: string
	foreground?: string
	population?: number
	title?: string
}

export type SanityImagePalette = {
	_type: "sanity.imagePalette"
	darkMuted?: SanityImagePaletteSwatch
	lightVibrant?: SanityImagePaletteSwatch
	darkVibrant?: SanityImagePaletteSwatch
	vibrant?: SanityImagePaletteSwatch
	dominant?: SanityImagePaletteSwatch
	lightMuted?: SanityImagePaletteSwatch
	muted?: SanityImagePaletteSwatch
}

export type SanityImageDimensions = {
	_type: "sanity.imageDimensions"
	height?: number
	width?: number
	aspectRatio?: number
}

export type SanityFileAsset = {
	_id: string
	_type: "sanity.fileAsset"
	_createdAt: string
	_updatedAt: string
	_rev: string
	originalFilename?: string
	label?: string
	title?: string
	description?: string
	altText?: string
	sha1hash?: string
	extension?: string
	mimeType?: string
	size?: number
	assetId?: string
	uploadId?: string
	path?: string
	url?: string
	source?: SanityAssetSourceData
}

export type Geopoint = {
	_type: "geopoint"
	lat?: number
	lng?: number
	alt?: number
}

export type Exercise = {
	_id: string
	_type: "exercise"
	_createdAt: string
	_updatedAt: string
	_rev: string
	name: string
	slug: Slug
	groups?: Array<{
		name: string
		slug: Slug
		_key: string
	}>
	type: "brainstorm" | "sliders" | "quadrants" | "form"
	instructions?: string
	steps?: Array<{
		prompt?: string
		helpText?: string
		color?: "green" | "red" | "yellow"
		_key: string
	}>
	removeSlidersVisual?: boolean
	sliders?: Array<{
		question_text: string
		today_text: string
		tomorrow_text: string
		slug: Slug
		left_value: string
		left_image?: {
			asset?: {
				_ref: string
				_type: "reference"
				_weak?: boolean
				[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
			}
			hotspot?: SanityImageHotspot
			crop?: SanityImageCrop
			alt?: string
			_type: "image"
		}
		right_value: string
		right_image?: {
			asset?: {
				_ref: string
				_type: "reference"
				_weak?: boolean
				[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
			}
			hotspot?: SanityImageHotspot
			crop?: SanityImageCrop
			alt?: string
			_type: "image"
		}
		_key: string
	}>
	today_instructions?: Array<{
		children?: Array<{
			marks?: Array<string>
			text?: string
			_type: "span"
			_key: string
		}>
		style?: "normal"
		listItem?: never
		markDefs?: null
		level?: number
		_type: "block"
		_key: string
	}>
	tomorrow_instructions?: Array<{
		children?: Array<{
			marks?: Array<string>
			text?: string
			_type: "span"
			_key: string
		}>
		style?: "normal"
		listItem?: never
		markDefs?: null
		level?: number
		_type: "block"
		_key: string
	}>
	finalize_instructions?: Array<{
		children?: Array<{
			marks?: Array<string>
			text?: string
			_type: "span"
			_key: string
		}>
		style?: "normal"
		listItem?: never
		markDefs?: null
		level?: number
		_type: "block"
		_key: string
	}>
	quadrants?: Array<{
		name: string
		slug: Slug
		topValue: string
		bottomValue: string
		leftValue: string
		rightValue: string
		topLeftImage?: {
			asset?: {
				_ref: string
				_type: "reference"
				_weak?: boolean
				[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
			}
			hotspot?: SanityImageHotspot
			crop?: SanityImageCrop
			alt?: string
			_type: "image"
		}
		topRightImage?: {
			asset?: {
				_ref: string
				_type: "reference"
				_weak?: boolean
				[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
			}
			hotspot?: SanityImageHotspot
			crop?: SanityImageCrop
			alt?: string
			_type: "image"
		}
		bottomLeftImage?: {
			asset?: {
				_ref: string
				_type: "reference"
				_weak?: boolean
				[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
			}
			hotspot?: SanityImageHotspot
			crop?: SanityImageCrop
			alt?: string
			_type: "image"
		}
		bottomRightImage?: {
			asset?: {
				_ref: string
				_type: "reference"
				_weak?: boolean
				[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
			}
			hotspot?: SanityImageHotspot
			crop?: SanityImageCrop
			alt?: string
			_type: "image"
		}
		_key: string
	}>
	form?: {
		steps?: Array<{
			fields?: Array<{
				type: "List" | "Narrow" | "Text" | "Big Text" | "Tagline"
				prompt: string
				additionalText?: string
				source?: {
					step: number
					field: number
				}
				placeholder?: string
				rows?: number
				showAddButton?: boolean
				addButtonText?: string
				min?: number
				max?: number
				color?: "red" | "green" | "yellow"
				_key: string
			}>
			_type: "step"
			_key: string
		}>
	}
}

export type SanityImageCrop = {
	_type: "sanity.imageCrop"
	top?: number
	bottom?: number
	left?: number
	right?: number
}

export type SanityImageHotspot = {
	_type: "sanity.imageHotspot"
	x?: number
	y?: number
	height?: number
	width?: number
}

export type SanityImageAsset = {
	_id: string
	_type: "sanity.imageAsset"
	_createdAt: string
	_updatedAt: string
	_rev: string
	originalFilename?: string
	label?: string
	title?: string
	description?: string
	altText?: string
	sha1hash?: string
	extension?: string
	mimeType?: string
	size?: number
	assetId?: string
	uploadId?: string
	path?: string
	url?: string
	metadata?: SanityImageMetadata
	source?: SanityAssetSourceData
}

export type SanityAssetSourceData = {
	_type: "sanity.assetSourceData"
	name?: string
	id?: string
	url?: string
}

export type SanityImageMetadata = {
	_type: "sanity.imageMetadata"
	location?: Geopoint
	dimensions?: SanityImageDimensions
	palette?: SanityImagePalette
	lqip?: string
	blurHash?: string
	hasAlpha?: boolean
	isOpaque?: boolean
}

export type Participant = {
	_id: string
	_type: "participant"
	_createdAt: string
	_updatedAt: string
	_rev: string
	name: string
	recovery_code?: string
	kickoff: {
		_ref: string
		_type: "reference"
		_weak?: boolean
		[internalGroqTypeReferenceTo]?: "kickoff"
	}
	onboarded: boolean
}

export type Kickoff = {
	_id: string
	_type: "kickoff"
	_createdAt: string
	_updatedAt: string
	_rev: string
	title: string
	code: Slug
	greeting: string
	exercises?: Array<{
		_ref: string
		_type: "reference"
		_weak?: boolean
		_key: string
		[internalGroqTypeReferenceTo]?: "exercise"
	}>
}

export type MediaTag = {
	_id: string
	_type: "media.tag"
	_createdAt: string
	_updatedAt: string
	_rev: string
	name?: Slug
}

export type Slug = {
	_type: "slug"
	current: string
	source?: string
}
export declare const internalGroqTypeReferenceTo: unique symbol


// Source: client.ts
// Variable: kickoffQuery
// Query: *[_type == "kickoff" && code.current == $code][0] {            ...,            exercises[]->        }
export type KickoffQueryResult = {
	_id: string
	_type: "kickoff"
	_createdAt: string
	_updatedAt: string
	_rev: string
	title: string
	code: Slug
	greeting: string
	exercises: Array<{
		_id: string
		_type: "exercise"
		_createdAt: string
		_updatedAt: string
		_rev: string
		name: string
		slug: Slug
		groups?: Array<{
			name: string
			slug: Slug
			_key: string
		}>
		type: "brainstorm" | "form" | "quadrants" | "sliders"
		instructions?: string
		steps?: Array<{
			prompt?: string
			helpText?: string
			color?: "green" | "red" | "yellow"
			_key: string
		}>
		removeSlidersVisual?: boolean
		sliders?: Array<{
			question_text: string
			today_text: string
			tomorrow_text: string
			slug: Slug
			left_value: string
			left_image?: {
				asset?: {
					_ref: string
					_type: "reference"
					_weak?: boolean
					[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
				}
				hotspot?: SanityImageHotspot
				crop?: SanityImageCrop
				alt?: string
				_type: "image"
			}
			right_value: string
			right_image?: {
				asset?: {
					_ref: string
					_type: "reference"
					_weak?: boolean
					[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
				}
				hotspot?: SanityImageHotspot
				crop?: SanityImageCrop
				alt?: string
				_type: "image"
			}
			_key: string
		}>
		today_instructions?: Array<{
			children?: Array<{
				marks?: Array<string>
				text?: string
				_type: "span"
				_key: string
			}>
			style?: "normal"
			listItem?: never
			markDefs?: null
			level?: number
			_type: "block"
			_key: string
		}>
		tomorrow_instructions?: Array<{
			children?: Array<{
				marks?: Array<string>
				text?: string
				_type: "span"
				_key: string
			}>
			style?: "normal"
			listItem?: never
			markDefs?: null
			level?: number
			_type: "block"
			_key: string
		}>
		finalize_instructions?: Array<{
			children?: Array<{
				marks?: Array<string>
				text?: string
				_type: "span"
				_key: string
			}>
			style?: "normal"
			listItem?: never
			markDefs?: null
			level?: number
			_type: "block"
			_key: string
		}>
		quadrants?: Array<{
			name: string
			slug: Slug
			topValue: string
			bottomValue: string
			leftValue: string
			rightValue: string
			topLeftImage?: {
				asset?: {
					_ref: string
					_type: "reference"
					_weak?: boolean
					[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
				}
				hotspot?: SanityImageHotspot
				crop?: SanityImageCrop
				alt?: string
				_type: "image"
			}
			topRightImage?: {
				asset?: {
					_ref: string
					_type: "reference"
					_weak?: boolean
					[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
				}
				hotspot?: SanityImageHotspot
				crop?: SanityImageCrop
				alt?: string
				_type: "image"
			}
			bottomLeftImage?: {
				asset?: {
					_ref: string
					_type: "reference"
					_weak?: boolean
					[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
				}
				hotspot?: SanityImageHotspot
				crop?: SanityImageCrop
				alt?: string
				_type: "image"
			}
			bottomRightImage?: {
				asset?: {
					_ref: string
					_type: "reference"
					_weak?: boolean
					[internalGroqTypeReferenceTo]?: "sanity.imageAsset"
				}
				hotspot?: SanityImageHotspot
				crop?: SanityImageCrop
				alt?: string
				_type: "image"
			}
			_key: string
		}>
		form?: {
			steps?: Array<{
				fields?: Array<{
					type: "Big Text" | "List" | "Narrow" | "Tagline" | "Text"
					prompt: string
					additionalText?: string
					source?: {
						step: number
						field: number
					}
					placeholder?: string
					rows?: number
					showAddButton?: boolean
					addButtonText?: string
					min?: number
					max?: number
					color?: "green" | "red" | "yellow"
					_key: string
				}>
				_type: "step"
				_key: string
			}>
		}
	}> | null
} | null

// Variable: participantQuery
// Query: *[_type == "participant" && _id == $id][0]
export type ParticipantQueryResult = {
	_id: string
	_type: "participant"
	_createdAt: string
	_updatedAt: string
	_rev: string
	name: string
	recovery_code?: string
	kickoff: {
		_ref: string
		_type: "reference"
		_weak?: boolean
		[internalGroqTypeReferenceTo]?: "kickoff"
	}
	onboarded: boolean
} | null

// Variable: participantWithKickoffCodeQuery
// Query: *[_type == "participant" && _id == $id][0] {            ...,            kickoff->{ "code": code.current }        }
export type ParticipantWithKickoffCodeQueryResult = {
	_id: string
	_type: "participant"
	_createdAt: string
	_updatedAt: string
	_rev: string
	name: string
	recovery_code?: string
	kickoff: {
		code: string
	}
	onboarded: boolean
} | null

// Variable: participantsInKickoffQuery
// Query: *[_type == "participant" && kickoff._ref == $kickoffId]
export type ParticipantsInKickoffQueryResult = Array<{
	_id: string
	_type: "participant"
	_createdAt: string
	_updatedAt: string
	_rev: string
	name: string
	recovery_code?: string
	kickoff: {
		_ref: string
		_type: "reference"
		_weak?: boolean
		[internalGroqTypeReferenceTo]?: "kickoff"
	}
	onboarded: boolean
}>


